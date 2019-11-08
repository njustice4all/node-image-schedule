import fetch from 'node-fetch';

import config from '../config';

const createTemplate = (success: boolean, text: string) => {
  const date = new Date().toLocaleString();
  if (success) {
    return JSON.stringify({
      text: 'v2 모바일홈 배너 이미지 업로드 완료 :the_horns:',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${date} v2 모바일홈 배너 이미지 업로드 완료 :the_horns:`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text,
          },
        },
      ],
    });
  }

  return JSON.stringify({
    text: 'v2 모바일홈 배너 이미지 업로드 실패 :angry:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${date} v2 모바일홈 배너 이미지 업로드 실패 :angry:`,
        },
      },
    ],
  });
};

export async function sendNotification(text: string) {
  try {
    await fetch(config.SLACK_WEB_HOOK_URL, {
      method: 'POST',
      body: createTemplate(true, text),
    });
  } catch (error) {
    await fetch(config.SLACK_WEB_HOOK_URL, {
      method: 'POST',
      body: createTemplate(false, text),
    });
    console.error(error, 'web hook fail');
  }
}
