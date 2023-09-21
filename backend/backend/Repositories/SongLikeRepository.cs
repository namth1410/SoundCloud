using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SongLikeRepository : ISongLikeRepository
    {
        private readonly SoundCloudContext context;

        public SongLikeRepository(SoundCloudContext context)
        {
            this.context = context;
        }
        public async Task<List<Song>> getSongLikeList(int idUser)
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