
using Bussiness.Services.LoginService;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bussiness.Jobs
{
    public class BackgroundJob : IJob
    {
        private readonly ILoginService _loginService;

        public BackgroundJob(ILoginService loginService)
        {
            _loginService = loginService;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            //await  _loginService.ListofAbsentees();
            Console.WriteLine("------------Job Çalıştı------------------");

            throw new NotImplementedException();
        }
    }
}
