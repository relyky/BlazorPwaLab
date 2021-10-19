using Microsoft.JSInterop;
using System;
using System.Threading.Tasks;

namespace MyBlazor.RazorComponent
{
    // This class provides an example of how JavaScript functionality can be wrapped
    // in a .NET class for easy consumption. The associated JavaScript module is
    // loaded on demand when first needed.
    //
    // This class can be registered as scoped DI service and then injected into Blazor
    // components for use.

    public class QrCodeInterop : IAsyncDisposable
    {
        #region Resource
        private readonly Lazy<Task<IJSObjectReference>> moduleTask;

        public event EventHandler<ScanResponseEvnetArgs> OnScanResponseEvnet;
        public class ScanResponseEvnetArgs : EventArgs
        {
            public string type;
            public string message;
        }
        #endregion

        public QrCodeInterop(IJSRuntime jsRuntime)
        {
            moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
               "import", "./_content/MyBlazor.RazorComponent/tools/qrcodeTools.js").AsTask());
        }

        #region Dispose
        public async ValueTask DisposeAsync()
        {
            if (moduleTask.IsValueCreated)
            {
                var module = await moduleTask.Value;
                await module.DisposeAsync();
            }
        }
        #endregion

        public async ValueTask<string> ScanQrCodeOnce(string elementId)
        {
            var module = await moduleTask.Value;
            return await module.InvokeAsync<string>("scanQrCodeOnce", elementId);
        }

        public async Task ScanQrCodeAsync(string elementId, bool f_readStop)
        {
            var module = await moduleTask.Value;
            await module.InvokeVoidAsync("scanQrCode", DotNetObjectReference.Create(this), elementId, f_readStop);
        }

        public async Task StopScanAsync()
        {
            var module = await moduleTask.Value;
            await module.InvokeVoidAsync("stopScan", DotNetObjectReference.Create(this));
        }

        [JSInvokable("OnScanResponse")]
        public Task<int> HandleScanResponse(string type, string message)
        {
            OnScanResponseEvnet?.Invoke(this, new ScanResponseEvnetArgs
            {
                type = type,
                message = message
            });

            return Task.FromResult(0);
        }
    }
}
