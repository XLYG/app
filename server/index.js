const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

const { decryptSecret, encryptSecret } = require('./crypto');
const { createPool } = require('./db');

dotenv.config({ path: 'server/.env' });

const app = express();
const port = Number(process.env.APP_PORT || 3001);

let pool;

app.use(cors());
app.use(express.json());

app.use((error, _request, response, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ ok: false, message: '请求格式不正确。' });
    return;
  }

  next(error);
});

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'ai-study-assistant-api' });
});

app.get('/api/db/health', async (_request, response) => {
  try {
    if (!pool) {
      pool = createPool();
    }

    await pool.query('SELECT 1');
    response.json({ ok: true, database: 'mysql' });
  } catch (_error) {
    response.status(503).json({
      ok: false,
      message: '数据库暂时不可用，请检查 MySQL 和后端环境变量配置。',
    });
  }
});

function getPool() {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

function normalizeUsername(username) {
  return typeof username === 'string' ? username.trim() : '';
}

function normalizeApiKey(apiKey) {
  return typeof apiKey === 'string' ? apiKey.trim() : '';
}

function normalizeMessage(message) {
  return typeof message === 'string' ? message.trim() : '';
}

app.get('/api/config/:username', async (request, response) => {
  const username = normalizeUsername(request.params.username);

  if (!username) {
    response.status(400).json({ ok: false, message: '请先填写用户名。' });
    return;
  }

  try {
    const [rows] = await getPool().execute(
      `SELECT id
       FROM user_api_keys
       WHERE username = ? AND provider = 'deepseek' AND deleted_at IS NULL
       LIMIT 1`,
      [username],
    );

    response.json({ ok: true, username, hasApiKey: rows.length > 0 });
  } catch (_error) {
    response.status(503).json({ ok: false, message: '暂时无法读取配置，请稍后再试。' });
  }
});

app.post('/api/config', async (request, response) => {
  const username = normalizeUsername(request.body?.username);
  const apiKey = normalizeApiKey(request.body?.apiKey);

  if (!username) {
    response.status(400).json({ ok: false, message: '请先填写用户名。' });
    return;
  }

  if (!apiKey) {
    response.status(400).json({ ok: false, message: '请填写 DeepSeek API Key。' });
    return;
  }

  try {
    const encryptedApiKey = encryptSecret(apiKey);

    await getPool().execute(
      `INSERT INTO user_api_keys (username, provider, api_key_encrypted, deleted_at)
       VALUES (?, 'deepseek', ?, NULL)
       ON DUPLICATE KEY UPDATE
         api_key_encrypted = VALUES(api_key_encrypted),
         deleted_at = NULL,
         updated_at = CURRENT_TIMESTAMP`,
      [username, encryptedApiKey],
    );

    response.json({ ok: true, username, provider: 'deepseek', hasApiKey: true });
  } catch (_error) {
    response.status(503).json({ ok: false, message: '保存失败，请检查后端和数据库配置。' });
  }
});

app.delete('/api/config/:username/key', async (request, response) => {
  const username = normalizeUsername(request.params.username);

  if (!username) {
    response.status(400).json({ ok: false, message: '请先填写用户名。' });
    return;
  }

  try {
    const [result] = await getPool().execute(
      `UPDATE user_api_keys
       SET api_key_encrypted = '', deleted_at = CURRENT_TIMESTAMP
       WHERE username = ? AND provider = 'deepseek' AND deleted_at IS NULL`,
      [username],
    );

    response.json({ ok: true, username, hasApiKey: false, deleted: result.affectedRows > 0 });
  } catch (_error) {
    response.status(503).json({ ok: false, message: '删除失败，请检查后端和数据库配置。' });
  }
});

app.post('/api/chat', async (request, response) => {
  const username = normalizeUsername(request.body?.username);
  const message = normalizeMessage(request.body?.message);

  if (!username) {
    response.status(400).json({ ok: false, message: '请先填写用户名。' });
    return;
  }

  if (!message) {
    response.status(400).json({ ok: false, message: '请输入学习问题。' });
    return;
  }

  try {
    const [rows] = await getPool().execute(
      `SELECT api_key_encrypted
       FROM user_api_keys
       WHERE username = ? AND provider = 'deepseek' AND deleted_at IS NULL
       LIMIT 1`,
      [username],
    );

    if (rows.length === 0) {
      response.status(400).json({ ok: false, message: '还没有保存 DeepSeek API Key。' });
      return;
    }

    const apiKey = decryptSecret(rows[0].api_key_encrypted);
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

    const deepseekResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              '你是一个耐心、清晰的 AI 学习助手。用中文回答，优先给出适合初学者理解的解释。',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      response.status(502).json({ ok: false, message: 'DeepSeek 请求失败，请检查 Key 是否可用。' });
      return;
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      response.status(502).json({ ok: false, message: 'DeepSeek 没有返回可展示的内容。' });
      return;
    }

    response.json({ ok: true, answer });
  } catch (_error) {
    response.status(503).json({ ok: false, message: '聊天请求失败，请稍后再试。' });
  }
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
