const refValidator = async function (model, id) {
  // Check if the document exists in the database
  var response = await model.findOne({
    _id: id,
    isDelete: false,
  });
  // Return true if it exists, false otherwise
  return !!response;
};

module.exports = refValidator;
