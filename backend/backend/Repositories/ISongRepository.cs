using backend.Data;

namespace backend.Repositories
{
    public interface ISongRepository
    {
        public Task<List<Song>> getSong(string nameSong);

        public Task<List<Song>> getSongLikeList(string idUser);

    }
}