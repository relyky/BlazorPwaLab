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
    }
}
