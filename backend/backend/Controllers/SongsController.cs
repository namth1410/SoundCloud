using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Principal;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly SoundCloudContext _context;
        private readonly ISongRepository _songRepository;
        private readonly UserManager<Account> _userManager;
        public SongsController(SoundCloudContext context, ISongRepository songRepository, UserManager<Account> userManager)
        {
            _context = context;
            _songRepository = songRepository;
            _userManager = userManager;
        }

        [HttpPost("increaseSongViews")]
        public async Task<ActionResult> IncreaseSongViews([FromQuery] string idSong)
        {
            var song = await _context.Songs.FirstOrDefaultAsync(s => s.Id == int.Parse(idSong));

            if (song != null)
            {
                // Tăng số lượt xem cho bài hát
                song.Views++;

                await _context.SaveChangesAsync();

                return Ok(song.Views);
            }
            else
            {
                return NotFound("Không tìm thấy bài hát.");
            }
        }


        // GET: api/Songs
        [Authorize]
        [HttpGet("getSongLike")]

        public async Task<ActionResult<IEnumerable<Song>>> GetSongsLike()
        {
            if (_context.SongLike == null)
            {
                return NotFound();
            }
            var identity = (ClaimsIdentity)User.Identity;

            var idUser = identity.FindFirst("idUser").Value;
            return await _songRepository.getSongLikeList(idUser);
        }

        [Authorize]
        [HttpPost("addSongLike")]
        public async Task<ActionResult> PostSongLike([FromQuery] string idSong)
        {
            /*            if (_context.SongLike == null)
                        {
                            return Problem("Entity set 'SoundCloudContext.Songs'  is null.");
                        }*/

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var identity = (ClaimsIdentity)User.Identity;
            var t = identity.FindFirst("idUser").Value;

            var claims = identity.Claims.Select(c => new { Type = c.Type, Value = c.Value });
            var usernameClaim = identity.Claims
                .FirstOrDefault(c => c.Type == "username");
            var username = identity.Claims
                .Where(c => c.Type == "idUser")
                .Select(c => c.Value);


            //var json = JsonConvert.SerializeObject(usernameClaim, Formatting.Indented);
            //var jObject = JObject.Parse(json);
            //var user = await _userManager.GetUserAsync(User);
            //var idUser = user.Id;
            var existingSongLike = await _context.SongLike
                .FirstOrDefaultAsync(sl => sl.IdUser == t && sl.IdSong == int.Parse(idSong));
            if (existingSongLike != null)
            {
                // Nếu đã tồn tại, bạn có thể xử lý tương ứng, ví dụ: trả về lỗi hoặc thông báo rằng đã tồn tại.
                return BadRequest("Dòng dữ liệu đã tồn tại.");
            }
            var song = new SongLike();
            song.IdUser = t;
            song.IdSong = int.Parse(idSong);
            _context.SongLike.Add(song);

            var likedSong = await _context.Songs.FirstOrDefaultAsync(s => s.Id == int.Parse(idSong));
            if (likedSong != null)
            {
                likedSong.Likes++;
            }
            await _context.SaveChangesAsync();

            return Ok(username);
        }

        [Authorize]
        [HttpDelete("deleteSongLike")]
        public async Task<ActionResult> DeleteSongLike([FromQuery] string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var songLikeToDelete = _context.SongLike
                    .FirstOrDefault(sl => sl.IdUser == idUser && sl.IdSong == int.Parse(idSong));

            if (songLikeToDelete != null)
            {
                _context.SongLike.Remove(songLikeToDelete);
                await _context.SaveChangesAsync();

                var likedSong = await _context.Songs.FirstOrDefaultAsync(s => s.Id == int.Parse(idSong));
                if (likedSong != null && likedSong.Likes > 0)
                {
                    likedSong.Likes--;
                    await _context.SaveChangesAsync();
                }

                return Ok();
            }
            else
            {
                return NotFound("Không tìm thấy dòng dữ liệu để xóa.");
            }
        }

        // GET: api/Songs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongs()
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            return await _context.Songs.ToListAsync();
        }


        /**
         * History
         * 
        */

        // GET: api/Songs
        [Authorize]
        [HttpGet("getHistory")]
        public async Task<ActionResult<IEnumerable<Song>>> GetHistory()
        {

            if (_context.History == null)
            {
                return NotFound();
            }
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;
            /*            var listHistory = _context.History
                            .Where(sl => sl.IdUser == idUser)
                            .ToList();*/
            var listHistory = _context.History
                .Where(h => h.IdUser == idUser)
                .Include(h => h.Song) // Nối bảng Song
                .Select(h => h.Song) // Chọn các bản ghi từ bảng Song
                .ToList();

            Console.WriteLine(listHistory);
            return Ok(listHistory);
        }

        [Authorize]
        [HttpPost("addHistory")]
        public async Task<ActionResult<IEnumerable<Song>>> AddHistory([FromQuery] string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            // Kiểm tra xem idSong có tồn tại trong bảng Songs không
            var existingSong = await _context.Songs
                .AnyAsync(song => song.Id == int.Parse(idSong));

            if (!existingSong)
            {
                // Nếu idSong không tồn tại trong bảng Songs, trả về BadRequest hoặc mã lỗi khác tùy theo logic của ứng dụng
                return BadRequest("Bài hát không tồn tại");
            }

            var lengthHis = await _context.History
                .Where(sl => sl.IdUser == idUser)
                .CountAsync();

            var existingHistory = await _context.History
                .FirstOrDefaultAsync(sl => sl.IdUser == idUser && sl.IdSong == int.Parse(idSong));

            if (existingHistory == null)
            {
                if (lengthHis == null || (lengthHis < 5))
                {
                    var history = new History();
                    history.IdUser = idUser;
                    history.IdSong = int.Parse(idSong);
                    _context.History.Add(history);
                    await _context.SaveChangesAsync();
                }
                else if (lengthHis == 5)
                {
                    var oldestHistory = await _context.History
                        .Where(sl => sl.IdUser == idUser)
                        .OrderBy(sl => sl.Id)
                        .FirstOrDefaultAsync();

                    if (oldestHistory != null)
                    {
                        // Xóa hàng cũ nhất
                        _context.History.Remove(oldestHistory);
                        await _context.SaveChangesAsync();

                        // Thêm lịch sử mới
                        var history = new History();
                        history.IdUser = idUser;
                        history.IdSong = int.Parse(idSong);
                        _context.History.Add(history);
                        await _context.SaveChangesAsync();
                    }

                }
            }
            else
            {
                _context.History.Remove(existingHistory);
                await _context.SaveChangesAsync();

                var history = new History();
                history.IdUser = idUser;
                history.IdSong = int.Parse(idSong);
                _context.History.Add(history);
                await _context.SaveChangesAsync();

            }
            var newSongs = _context.History
                .Where(h => h.IdUser == idUser)
                .Select(h => h.Song)
                .ToList();

            return Ok(newSongs);
        }


        [Authorize]
        [HttpDelete("deleteHistory")]
        public async Task<ActionResult<IEnumerable<Song>>> DeleteHistory([FromQuery] string idSong)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var _history = _context.History
                    .FirstOrDefault(sl => sl.IdUser == idUser && sl.IdSong == int.Parse(idSong));

            if (_history != null)
            {
                _context.History.Remove(_history);
                await _context.SaveChangesAsync();

                var remainingSongs = _context.History
                    .Where(h => h.IdUser == idUser)
                    .Select(h => h.Song)
                    .ToList();
                return Ok(remainingSongs);
            }
            else
            {
                return NotFound(new List<Song>());
            }
        }


        [Authorize]
        [HttpDelete("deleteHistoryAll")]
        public async Task<ActionResult> DeleteHistoryAll()
        {
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var _history = _context.History
                .Where(sl => sl.IdUser == idUser)
                .ToList();


            if (_history != null && _history.Any())
            {
                _context.History.RemoveRange(_history);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return NotFound("Không tìm thấy dòng dữ liệu để xóa.");
            }
        }


        /**
         * End History
         * 
        */


        // GET: api/Songs/5
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSong(int id)
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            var song = await _context.Songs.FindAsync(id);

            if (song == null)
            {
                return NotFound();
            }

            return Ok(song);
        }

        // PUT: api/Songs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSong(int id, Song song)
        {
            if (id != song.Id)
            {
                return BadRequest();
            }

            _context.Entry(song).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SongExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Songs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Song>> PostSongFromUser(SongModel songModel)
        {
            if (_context.Songs == null)
            {
                return Problem("Entity set 'SoundCloudContext.Songs'  is null.");
            }
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;

            var song = new Song();
            song.IdUser = idUser;
            song.NameSong = songModel.nameSong;
            song.NameAuthor = "Trần Nam";
            song.LinkSong = songModel.linkSong;
            _context.Songs.Add(song);
            await _context.SaveChangesAsync();



            return CreatedAtAction("GetSong", new { id = song.Id }, song);
        }

        // DELETE: api/Songs/5
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteSong([FromQuery] string idSong)
        {
            if (_context.Songs == null)
            {
                return NotFound();
            }
            var song = await _context.Songs.FindAsync(int.Parse(idSong));
            var identity = (ClaimsIdentity)User.Identity;
            var idUser = identity.FindFirst("idUser").Value;
            if (song == null || (idUser != song.IdUser))
            {
                return NotFound();
            }

            _context.Songs.Remove(song);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SongExists(int id)
        {
            return (_context.Songs?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}