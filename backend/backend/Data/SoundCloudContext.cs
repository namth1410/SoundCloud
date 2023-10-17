using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Data
{
    public class SoundCloudContext : IdentityDbContext<Account>
    {
        public SoundCloudContext(DbContextOptions<SoundCloudContext> opt) : base(opt) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<History>()
                .HasOne(h => h.User)  // Mối quan hệ với IdentityUser
                .WithMany()
                .HasForeignKey(h => h.IdUser)
                .OnDelete(DeleteBehavior.Restrict);  // Xác định xử lý xóa

            modelBuilder.Entity<History>()
                .HasOne(h => h.Song)  // Mối quan hệ với bảng Song
                .WithMany()
                .HasForeignKey(h => h.IdSong)
                .OnDelete(DeleteBehavior.Restrict);
        }

        #region
        public DbSet<Song> Songs { get; set; }
        public DbSet<SongLike> SongLike { get; set; }
        public DbSet<History> History { get; set; }
        public DbSet<Playlist> Playlist { get; set; }
        public DbSet<PlaylistSongs> PlaylistSongs { get; set; }
        #endregion


    }
}