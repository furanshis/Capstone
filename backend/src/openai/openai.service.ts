import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import OpenAI from 'openai';
import { DataSource } from 'typeorm';
import { Parser } from 'node-sql-parser';
@Injectable()
export class OpenaiService {
    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAI
    constructor( private readonly dataSource: DataSource){
        this.openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    }

    private readonly apiKey = process.env.OPENAI_API_KEY;


    private validateQuery(query: string): boolean {
      // Remove comments and whitespace
      const cleanQuery = query
        .replace(/--.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim();
  
      // Check if query starts with SELECT
      if (!cleanQuery.toLowerCase().startsWith('select') && 
        !cleanQuery.toLowerCase().startsWith('insert') && 
        !cleanQuery.toLowerCase().startsWith('update')) {
        throw new ForbiddenException('Solo consultas SELECT, INSERT Y UPDATE están permitidas');
      }
  
      // Check for forbidden keywords that might modify data
      const forbiddenKeywords = [
        'delete',
        'drop',
        'truncate',
        'alter',
        'create',
        'replace',
        'upsert',
        'merge',
        'grant',
        'revoke',
      ];
  
      const hasModificationKeywords = forbiddenKeywords.some(keyword =>
        cleanQuery.toLowerCase().includes(keyword)
      );
  
      if (hasModificationKeywords) {
        throw new ForbiddenException('No se puede realizar la consulta, acceso restringido');
      }
  
      return true;
    }

    private extractTableName(query: string): string {
      const cleanQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
      let tableName = '';
  
      if (cleanQuery.startsWith('select')) {
        const fromMatch = cleanQuery.match(/from\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
        tableName = fromMatch ? fromMatch[1] : '';
      } else if (cleanQuery.startsWith('insert')) {
        const intoMatch = cleanQuery.match(/into\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
        tableName = intoMatch ? intoMatch[1] : '';
      } else if (cleanQuery.startsWith('update')) {
        const updateMatch = cleanQuery.match(/update\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
        tableName = updateMatch ? updateMatch[1] : '';
      }
  
      return tableName;
    }

    private async tableExists(tableName: string): Promise<boolean> {
      try {
        const result = await this.dataSource.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [tableName]);
        return result[0].exists;
      } catch (error) {
        return false;
      }
    }

    private async interpretInsertResult(result: any, query: string): Promise<any> {
      const interpretation = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en SQL que interpreta las sentencias Insert de manera concisa. explica lo que se hizo de manera simple, para que todo el mundo lo entienda sin tecnicismo',
          },
          {
            role: 'user',
            content: `interpreta esta sentencia Insert: ${query}`,
          },
        ],
        model: 'gpt-4o-mini',
      });
  
      return {
        message: 'Data insertado correctamente',
        affectedRows: result.length || 1,
        interpretation: interpretation.choices[0].message.content,
      };
    }

    
    private async interpretUpdateResult(result: any, query: string): Promise<any> {
      const interpretation = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en SQL que interpreta las sentencias UPDATE de manera concisa. explica lo que se hizo de manera simple, para que todo el mundo lo entienda.',
          },
          {
            role: 'user',
            content: `Interpret this UPDATE operation: ${query}`,
          },
        ],
        model: 'gpt-3.5-turbo',
      });

      return {
        message: 'Data updated successfully',
        affectedRows: result.length || result.affected || 1,
        interpretation: interpretation.choices[0].message.content,
      };
    }


    async generarSQL(pregunta: string): Promise<any>{
      try {

        // obtener el esquema de la base de datos
        const dbSchema = await this.getDatabaseSchema();
        const intentAnalysis = await this.analyzeQueryIntent(pregunta, dbSchema);
        const completion = await this.openai.chat.completions.create({
          
            messages: [
              {
                role: 'system',
                content: `Eres un experto en consultas SQL. Conoces todo sobre las base de datos PostgreSQL. generas sentencias SQL. 
                -Solo generas sentencias SELECT y INSERT y UPDATE.
                -nunca entregues los ids de las filas.
                -no insertes datos ficticios, solo los que da el usuario en la consulta.
                -en las consultas INSERT y UPDATE agrega RETURNING * al final de la sentencia (solo en esas dos consultas, no en las SELECT), entregando las filas afectadas.
                -Cuando utilices el condicional WHERE, simepre utiliza el ILIKE para evitar problemas con mayúsculas y minúsculas.
                -Si el resultado de la consulta son varias filas, muestra la información como tablas en formato HTML.
                -si la entidad no existe en la base de datos, no generas sentencias..
                -Entrega solo la sentencia, no agregues comillas, ni nigun simbolo.
                -solo entregas la consulta SQL, nada más.
                -existe una base de datos con las siguientes tablas y columnas: ${JSON.stringify(dbSchema)}.
                -Cuando existan relaciones entre tablas, intenta al menos traer el nombre de la tabla que entrega la lláve foranea. Hace un Join.`,
              },
              {
                role: 'user',
                content: `Genera una sentencia SQL con: ${pregunta}`,
              },
            ],
            model: 'gpt-4o-mini',
            temperature: 0.1,
          });
      
          const sqlQuery = completion.choices[0].message.content;  
          console.log('---------------- SQL Query ----------------')
          console.log(sqlQuery)
          console.log('--------------------------------------------')

          //Validar la consulta antes de ejecutar
          this.validateQuery(sqlQuery);


          const tableName = this.extractTableName(sqlQuery);
          if (tableName && !(await this.tableExists(tableName))) {
            return {
              success: false,
              error: `La tabla '${tableName}' no existe en la base de datos`,
              query: sqlQuery
            };
          }

          try {
            const result = await this.dataSource.query(sqlQuery);
            console.log(result)
            return {
              resultados: result,  
          }  
          } catch (error){
            return {
              error: error
            }
          }
          

          

          
          

          /*
          const response: any = {
            query: sqlQuery,
            success: true
          };

          console.log(response)


          if (sqlQuery.toLowerCase().startsWith('select')) {
              const interpretation = await this.interpretResults(result, sqlQuery);
              Object.assign(response, interpretation);
          } else if (sqlQuery.toLowerCase().startsWith('insert')) {
              const interpretation = await this.interpretInsertResult(result, sqlQuery);
              Object.assign(response, interpretation);
          } else if (sqlQuery.toLowerCase().startsWith('update')) {
              const interpretation = await this.interpretUpdateResult(result, sqlQuery);
              Object.assign(response, interpretation);
            }
            
          return response;
          
          */
            
        } catch (error) {
          this.logger.error(`Error in generateAndExecuteQuery: ${error.message}`);
          return {
            error: error
          }
        }
    }

    private async interpretResults(results: any[], originalQuestion: string): Promise<any> {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Eres un experto interpretando los resultados de las consultas SQL y explicandolas de maneras simples para que todo el mundo lo entienda. cuando se habla de dinero es en peso chileno. No usas términos tecnicos. Recuerda que el usuario no ve el resultado de la sentencia, solo la interpretación. Si en los resultados se traen varias filas, separalas por tablas en formato HTML. No seas redundante',
          },
          {
            role: 'user',
            content: `pregunta inicial: ${originalQuestion}\n\nResultado SQL: ${JSON.stringify(results, null, 2)}\n\nPor favor prove de una interpretación clara, no tan técnica de estos resultados en lenguaje natural.`,
          },
        ],
        model: 'gpt-4o-mini',
      });
  
      return {
        results,
        count: results.length,
        interpretation: completion.choices[0].message.content,
      };
    }

    private async analyzeQueryIntent(userInput: string, dbSchema: any) {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Analiza la intención de la consulta del usuario, que quiere conseguir y identifica: 
              1. La entidad principal que esta buscando información.
              2. Que tipo de información está buscando.
              3. cualquier restricción relacionada al tiempo.
              4. Cualquier condición especificas. 
              Este es el esquema de la base de datos: ${JSON.stringify(dbSchema)}
              Retorna un JSON con estas condiciones: entidad, tipoInformación, restriccionTiempo, condiciones.`,
          },
          {
            role: 'user',
            content: `Query: ${userInput}`
          }
        ],
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" }
      });
  
      return JSON.parse(completion.choices[0].message.content);
    }


    private async getDatabaseSchema(): Promise<any> {
      try {
        // Get all tables
        const tables = await this.dataSource.query(`
          SELECT 
            t.table_name,
            json_agg(
              json_build_object(
                'column_name', c.column_name,
                'data_type', c.data_type,
                'is_nullable', c.is_nullable,
                'column_default', c.column_default
              )
            ) as columns,
            obj_description(pgc.oid, 'pg_class') as table_description
          FROM 
            information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            JOIN pg_class pgc ON t.table_name = pgc.relname
          WHERE 
            t.table_schema = 'public'
          GROUP BY 
            t.table_name, pgc.oid;
        `);
  
        // Get foreign key relationships
        const relationships = await this.dataSource.query(`
          SELECT
            tc.table_name as table_name,
            kcu.column_name as column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY';
        `);
  
        // Get indexes
        const indexes = await this.dataSource.query(`
          SELECT
            tablename as table_name,
            indexname as index_name,
            indexdef as index_definition
          FROM
            pg_indexes
          WHERE
            schemaname = 'public';
        `);
  
        return {
          tables,
          relationships,
          indexes
        };
      } catch (error) {
        this.logger.error(`Error getting database schema: ${error.message}`);
        throw new Error('Failed to retrieve database schema');
      }
    }


    private async generateEmptyResultMessage(
      userInput: string,
      intentAnalysis: any,
      dbSchema: any
    ): Promise<string> {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Eres un experto explicando resultados de consultas SQL de manera amigable con el usuario.
              Cuando no se encuentra ningún resultado, prove una clara, contextual explicación de por que.
              centrate en el contexto del negocio y evita terminos tecnicos.
              hace que el mensaje sea natural y util.
              Este es el esquema de la base de datos: ${JSON.stringify(dbSchema)}`
          },
          {
            role: 'user',
            content: `pregunta original: ${userInput}
              La intención de la consulta: ${JSON.stringify(intentAnalysis)}
              Result: No data found

              Genera un mensaje amigable con el usuario que explique porque no hay resultados.`
          }
        ],
        model: 'gpt-4o-mini'
      });
  
      return completion.choices[0].message.content;
    }


}
