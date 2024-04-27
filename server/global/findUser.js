// const User = require("../models/staff");



// async function findUser(email) {
//     var person = await User.findOne({ email }).exec();
//     console.log("PERSON",person);
//     const role = person.role;
//     if (person) {
//         try {
//             person._doc.role = role || "USER";
//         } catch (error) {
//         }
//         person = { ...person, role: role || "USER" };
//         return person
//     }

// }

// module.exports = findUser;