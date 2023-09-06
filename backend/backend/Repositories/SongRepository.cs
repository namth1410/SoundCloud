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
    }
}