using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
