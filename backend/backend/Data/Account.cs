using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    public class Account : IdentityUser
    {
        public string Name { get; set; }
    }
}