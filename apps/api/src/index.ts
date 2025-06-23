import { handle } from "hono/aws-lambda";

import { app } from "./app";

// Lambda関数の開始と終了をログに記録するためのラッパー
export const handler = async (event: any, context: any) => {
  console.log('=== Lambda関数開始 ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  
  try {
    const result = await handle(app)(event, context);
    console.log('=== Lambda関数正常終了 ===');
    return result;
  } catch (error) {
    console.error('=== Lambda関数エラー ===');
    console.error('Error:', error);
    throw error;
  }
};
