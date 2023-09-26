using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly SoundCloudContext context;

        public SongRepository(SoundCloudContext context)
        {
            this.context = context;
        }
        public async Task<List<Song>> getSong(string nameSong)
        {
            var songs = await context.Songs
        .Where(song => song.NameSong.Contains(nameSong))
        .ToListAsync();

            return songs;
        }

        public async Task<List<Song>> getSongLikeList(string idUser)
        {
            var likedSongIds = await context.SongLike
                    .Where(like => like.IdUser == idUser)
                    .Select(like => like.IdSong)
                    .ToListAsync();

            var songs = await context.Songs
                .Where(song => likedSongIds.Contains(song.Id))
                .ToListAsync();

            return songs;
        }
    }
}