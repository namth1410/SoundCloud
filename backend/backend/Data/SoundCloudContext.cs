using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Data
{
    public class SoundCloudContext : IdentityDbContext<IdentityUser>
    {
        public SoundCloudContext(DbContextOptions<SoundCloudContext> opt) : base(opt) { }
        /*        protected override void OnModelCreating(ModelBuilder modelBuilder)
                {
                    modelBuilder.Entity<SongLike>()
                        .HasNoKey();
                }*/
        #region
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<SongLike> SongLike { get; set; }
        #endregion


    }
}