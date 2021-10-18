// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

export async function callPromise(message) {
  return await Promise.resolve(new Promise((resolve, reject) => {
    //------ 轉換成 Promise 形式以處理非同步計算。

    if (message === 'FAIL!') {
      console.log('callPromise', 'FAIL!');
      reject('FAIL!');
      return;
    }

    setTimeout(() => {
      console.log('callPromise', message);
      resolve(message);
      return;
    }, 2000);

    //------
  }));
}
