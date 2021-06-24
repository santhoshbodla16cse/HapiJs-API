const Hapi = require('hapi');
// const client = require("./conn/db");
const Connection =  require("./conn/dbconn");
const movies = require("./model/movies");
const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: 8004
    });
//Config:

const options = {
    query: {
      page: {
        name: 'page', // The page parameter will now be called the_page
        default:1
    },
      limit: {
        name: 'limit', // The limit will now be called per_page
        default: 10       // The default value will be 10
      }
    },
     meta: {
        location: 'body', // The metadata will be put in the response body
        name: 'metadata', // The meta object will be called metadata
        count: {
            active: true,
            name: 'count'
        },
        pageCount: {
            name: 'totalPages'
        },
        self: {
            active: false // Will not generate the self link
        },
        first: {
            active: false // Will not generate the first link
        },
        last: {
            active: false // Will not generate the last link
        }
     },
     routes: {
         include: ['/movies/l/list'],
     }
};
 
await server.register({plugin: require('hapi-pagination'), options: options})



//Routes
    server.route([
        {
        method: 'GET',
        path: '/movies/l/list',
        handler: async (request, h) => {
            const limit = request.query.limit
            const page = request.query.page
            const offset = limit * (page - 1)
            const search_movie =  request.query.search_movie;
            const res =await movies.findAll({
                attributes: ['movie_name']
            });
            
            var result= [];
            for(var i =0;i<res.length;i++){
            var obj = JSON.parse(JSON.stringify(res[i]));
            result.push(obj);
            }
            if(search_movie){
            var search_result =[];
            for(var i=0;i<result.length;i++){
                let match = result[i].movie_name.toLowerCase().match(search_movie.toLowerCase());
                // console.log(JSON.stringify(match));

                if(match){
                    search_result.push(result[i].movie_name);
                }
            }
            return h.paginate(search_result.slice(offset,page*limit), search_result.length);
            }
            console.table(result.slice(offset,page*limit));

            return h.paginate(res.slice(offset,page*limit), res.length);
        }
    },
    {
        method: 'GET',
        path: '/movies/g/{movieid}',
        handler: async (request, h) => {
            const res =await movies.findOne({
                where:{
                    id : request.params.movieid
                }
            });

            console.log(JSON.stringify(res, null, 1));
            if(res==null)
            return `"There is no movie with the given id : " ${request.params.movieid} "`;

            return res;
        }
    },
    {
        method: 'PATCH',
        path: '/movies/g/{movieid}',
        handler: async (request, h) => {
            try{
            const [numberOfAffectedRows, affectedRows] = await movies.update({ 
                movie_language: request.payload.lang,
                actor:request.payload.act
              }, {
                where: {id: request.params.movieid},
                returning: true, // needed for affectedRows to be populated
                plain: true // makes sure that the returned instances are just plain objects
              })
            }
            catch(e){
                console.log(`"There is no movie with the given id : " ${request.params.movieid} "`);
                return `"There is no movie with the given id : " ${request.params.movieid} "`
            }

              console.log(numberOfAffectedRows);      
              return `"updated" for movie ${request.params.movieid}`;
        }
    },
    {
        method: 'DELETE',
        path: '/movies/g/{movieid}',
        handler: async (request, h) => {
        
            const res = await movies.destroy({
                where: {
                  id: request.params.movieid 
                }
              })
            
            if(res==0)
            return `"There is no movie with the given id : " ${request.params.movieid} "`;
            
            return `"Deleted" movie with id : ${request.params.movieid}`
        }
    },
    {
        method: 'GET',
        path: '/{any*}',
        handler: (request, h) => {
            return `oh no you r lost`
        }
    }

    ]);

    await server.start();
    console.log(`Server started at ${server.info.uri}`);
    
}
//as we are using async function, if it rejects we will print the error here
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();


