using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBlazorPwa.Model
{
    public class UserSubscriptionInfo
    {
        /// <summary>
        /// 使用者識別碼
        /// </summary>
        public string userCode { get; set; }

        /// <summary>
        /// 訂閱 Token
        /// </summary>
        public PushSubscription subscription { get; set; }

        public class PushSubscription
        {
            public string endpoint { get; set; }
            public string expirationTime { get; set; }
            public Keys keys { get; set; }
        }

        public class Keys
        {
            public string p256dh { get; set; }
            public string auth { get; set; }
        }
    }
}
