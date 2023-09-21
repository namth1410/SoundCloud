using backend.Data;

namespace backend.Repositories
{
    public interface ISongLikeRepository
    {
        public Task<List<Song>> getSongLikeList(int idUser);
    }
}