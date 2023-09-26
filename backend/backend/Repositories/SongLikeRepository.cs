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

    }
}