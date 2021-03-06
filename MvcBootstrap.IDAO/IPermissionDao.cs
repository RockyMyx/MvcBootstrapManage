﻿using System.Collections.Generic;
//using MvcBootstrap.MssqlEFModel;
using MvcBootstrap.MysqlEFModel;
//using MvcBootstrap.OracleEFModel;
using MvcBootstrap.ViewModels;

namespace MvcBootstrap.IDAO
{
    public interface IPermissionDao : IBaseDao<T_Permission>
    {
        IEnumerable<PermissionViewModel> GetPermission(int roleId);
        void ClearPermission(int roleId);
    }
}
