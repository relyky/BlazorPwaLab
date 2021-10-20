using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyBlazorPwa
{
    static class ThisProjectClassExtensions
    {
        public static string ToJson(this object self, bool UnsafeRelaxedJsonEscaping = true, bool WriteIndented = true)
        {
            var options = new JsonSerializerOptions()
            {
                WriteIndented = WriteIndented
            };

            if (UnsafeRelaxedJsonEscaping)
                options.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;

            return JsonSerializer.Serialize(self, options);
        }

        /// <summary>
        /// ref→https://stackoverflow.com/questions/58138793/system-text-json-jsonelement-toobject-workaround
        /// </summary>
        public static T ToObject<T>(this JsonElement element, JsonSerializerOptions options = null)
        {
            var bufferWriter = new System.Buffers.ArrayBufferWriter<byte>();
            using (var writer = new Utf8JsonWriter(bufferWriter))
                element.WriteTo(writer);
            return JsonSerializer.Deserialize<T>(bufferWriter.WrittenSpan, options);
        }

        /// <summary>
        /// ref→https://stackoverflow.com/questions/58138793/system-text-json-jsonelement-toobject-workaround
        /// </summary>
        public static T ToObject<T>(this JsonDocument document, JsonSerializerOptions options = null)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));
            return document.RootElement.ToObject<T>(options);
        }

        /// <summary>
        /// JSON package only.
        /// </summary>
        public static async Task<TRes> CallWebApi2Async<TReq, TRes>(this HttpClient http, string apiPath, TReq req)
            where TReq : class
            where TRes : class
        {
            //HttpClient http = new HttpClient();
            //http.BaseAddress = new Uri(SysEnv.WebApi2BaseAddress); // 目標 Web API URL // 由環境取得
            //http.DefaultRequestHeaders.Add("Authorization", @"Bearer xxxxxxxx"); // 認證機制 // 由環境取得

            var response = await http.PostAsJsonAsync<TReq>(apiPath, req);
            if (!response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException(msg);
            }

            // success
            var resp = await response.Content.ReadFromJsonAsync<TRes>();
            return resp;
        }
    }
}
