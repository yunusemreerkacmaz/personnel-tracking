using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bussiness.Helper.Enums
{
    public enum NotificationTypeEnum
    {
        GetNotifies = 1,
        UpdateNotifies = 2,
        ListOfAbsentees = 3,
        ForgottenPassword = 4
    }

    public static class ConvertNotificationToString
    {
        public static string ConvertNotify(NotificationTypeEnum notificationTypeEnum)
        {
            switch (notificationTypeEnum)
            {
                case NotificationTypeEnum.GetNotifies:
                    return "GetNotifies";
                case NotificationTypeEnum.UpdateNotifies:
                    return "UpdateNotifies";
                case NotificationTypeEnum.ForgottenPassword:
                    return "ForgottenPassword";
                case NotificationTypeEnum.ListOfAbsentees:
                    return "ListOfAbsentees";
                default:
                    return "";
            }
        }
    }
}
