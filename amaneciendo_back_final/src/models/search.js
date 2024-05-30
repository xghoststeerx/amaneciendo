const { Op } = require("sequelize");
const sequelize = require("../config/database");


const SearchAll = {};

SearchAll.search = async (query) => {
  try {
    const results = await sequelize.query(`
    SELECT 
      ep.id AS id_ep, 
      p.id AS id,
      p.name, 
      p.description, 
      p.image, 
      p.id_categoria, 
      ep.price, 
      ep.quantity, 
      e.id_estanco, 
      e.nombre_estanco, 
      e.direccion_estanco, 
      e.barrio, 
      e.telefono_estanco, 
      e.imagen_estanco, 
      e.logo_estanco, 
      e.descripcion AS descripcion_estanco, 
      e.hora_estanco, 
      e.horario_estanco, 
      e.longitud, 
      e.latitud, 
      'product' AS type
    FROM 
      estanco_products ep
    JOIN 
      products p ON ep.id_product = p.id
    JOIN 
      estanco e ON ep.id_estanco = e.id_estanco
    WHERE 
      p.name LIKE :query
    UNION
    SELECT 
      e.id_estanco AS id, 
      NULL AS id,
      NULL AS name, 
      NULL AS description, 
      NULL AS image, 
      NULL AS id_categoria, 
      NULL AS price, 
      NULL AS quantity, 
      e.id_estanco, 
      e.nombre_estanco, 
      e.direccion_estanco, 
      e.barrio, 
      e.telefono_estanco, 
      e.imagen_estanco, 
      e.logo_estanco, 
      e.descripcion, 
      e.hora_estanco, 
      e.horario_estanco, 
      e.longitud, 
      e.latitud, 
      'estanco' AS type
    FROM 
      estanco e
    WHERE 
      e.nombre_estanco LIKE :query OR 
      e.barrio LIKE :query
    GROUP BY 
      e.id_estanco
  `, {
    replacements: { query: `%${query}%` },
    type: sequelize.QueryTypes.SELECT,
  });
    return results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = SearchAll;