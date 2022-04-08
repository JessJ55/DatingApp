using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);

        // Task<bool> SaveAllAsync(); se resuelve en IUnitOfWork

        Task<IEnumerable<AppUser>> GetUserAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<AppUser> GetUserByPhotoId(int photoId);

        //Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);//para la paginacion

        Task<MemberDto> GetMemberAsync(string username,bool isCurrentUser);
        //el parametro bool? para photoChallenge
        Task<string> GetUserGender(string username);
    }
}