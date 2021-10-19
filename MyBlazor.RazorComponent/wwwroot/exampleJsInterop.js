// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

// 同步行為函式，可以直接回應處理結果
export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

// 非同步行為函式，啟動某機制，將透過 dotNetObject 以訊息回應處理結果
export function enableMachine(dotNetObject, message) {
  if (message === 'FAIL!') {
    console.log('enableMachine', 'FAIL!');
    dotNetObject.invokeMethodAsync('OnResponse', 'FAIL', 'this is a fail message.');
    return;
  }

  setTimeout(() => {
    console.log('enableMachine', message);
    dotNetObject.invokeMethodAsync('OnMachineResponse', 'SUCCESS', message);
  }, 2000);
}

/// 非同步行為函式可以透過 Promise 與 async/await 轉換成同步行為。
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
