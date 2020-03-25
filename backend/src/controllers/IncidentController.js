const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const { page = 1 } = request.query; // para mostrar por paginas

        const [count] = await connection('incidents')
            .count(); // para contar quantos casos tem, e mostrar o total no incio da pagina

        //console.log(count);

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id') // para mostrar junto com o caso a ong que corresponde
            .limit(5) //serao mostrados 5 casos a cada vez
            .offset((page - 1) * 5) //para saber onde comeca
            .select(['incidents.*',  
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ]);
            //.select('*'); //se colocar somente * para mostrar tudo, o id da ong sobrepoe o do incident, ja que tem o mesmo nome. Entao foi feito o seguinte, conforme acima.

        response.header('X-Total-Count', count['count(*)']); // aqui vai retornar para o front-end a quantidade de resgistro, fica mais facil ter controle

        return response.json(incidents);
    },

    async create(request, response){
        const{title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({id});
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        
        if(incident.ong_id != ong_id){
            return response.status(401).json({error: 'Operation not permitted'});
        }
        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
}