using AutoMapper;
using backend.Data;
using backend.Models;
using System.Security.Principal;

namespace backend.Helpers
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Account, SignInModel>().ReverseMap();
        }
    }
}