﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
//using MvcBootstrap.MssqlEFModel;
using MvcBootstrap.MysqlEFModel;
//using MvcBootstrap.OracleEFModel;
using MvcBootstrap.Service;

namespace MvcBootstrap.Controllers
{
    public class RoleController : ManageController
    {
        RoleService roleService = new RoleService();

        public RoleController()
        {
            base.cacheAllKey = "AllRoles";
            base.cacheSearchKey = "SearchRoles";
        }

        protected override int DataCount
        {
            get { return roleService.GetEntitiesCount(); }
        }

        public override ActionResult Index()
        {
            Session.Remove(cacheAllKey);
            Session.Remove(cacheSearchKey);
            var result = roleService.GetPagingInfo(base.PageSize);
            ModuleService moduleService = new ModuleService();
            ViewData["ParentModule"] = moduleService.GetParentModules();
            return View(result);
        }

        public override ActionResult Index(int? pageIndex)
        {
            int index = pageIndex ?? 1;
            IEnumerable<T_Role> entities = (IEnumerable<T_Role>)Session[cacheSearchKey] ??
                                           roleService.GetAll();
            IEnumerable<T_Role> result = roleService.GetSearchPagingInfo(entities, index, base.PageSize);
            return PartialView("_RoleGrid", result);
        }

        public ActionResult Modify(T_Role role)
        {
            roleService.Update(role);
            return MyJson(role);
        }

        public override void Delete(List<int> ids)
        {
            roleService.Delete(ids);
        }

        public override void Create(FormCollection formInfo)
        {
            T_Role role = roleService.GetRoleInfo(formInfo);
            role.CreateDate = DateTime.Now;
            //ToTest
            //role.CreateUserID = Convert.ToInt32(Session["UserID"]);
            roleService.Create(role);
        }

        public override ActionResult Search(string name)
        {
            name = name.Trim();
            IEnumerable<T_Role> filterEntities = roleService.GetAll().Where(m => m.Name.Contains(name));
            Session[cacheSearchKey] = filterEntities;
            if (filterEntities.Count() == 0) return new EmptyResult();
            return PartialView("_RoleGrid", filterEntities);
        }

        public ActionResult GetPermission(int id)
        {
            PermissionService permissionService = new PermissionService();
            Dictionary<string, string> permissionList = permissionService.BuildPermission(id);
            return Json(permissionList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SetPermission(int id, FormCollection formInfo)
        {
            //ToTest
            //int modifyUserId = Convert.ToInt32(Session["UserId"]);
            int modifyUserId = 1;
            PermissionService permissionService = new PermissionService();
            permissionService.ClearPermission(id);
            permissionService.CreatePermission(id, formInfo.AllKeys, modifyUserId);
        }
    }
}
