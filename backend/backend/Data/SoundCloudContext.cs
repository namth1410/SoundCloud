using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Data
{
    public class SoundCloudContext : IdentityDbContext<IdentityUser>
    {
        public SoundCloudContext(DbContextOptions<SoundCloudContext> opt) : base(opt) { }

        #region
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Song> Songs { get; set; }
        #endregion
    }
}