const mongoose = require("mongoose");
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    quantity: {
      type: Number,
      default: 0,
      min: [1, "Must be at least 1, got {VALUE}"],
    },
    sold: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    ratings: [
      {
        star: {
          type: Number,
        },
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// //trước khi lưu vào db

// userSchema.pre("save", async function (next) {
//   // 1) Only run this function if password was actually modified
//   if (!this.isModified("password")) return next();

//   const salt = bcrypt.genSaltSync(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // sau khi
// userSchema.methods = {
//   isCorrectPassword: async function (password) {
//     return await bcrypt.compare(password, this.password);
//   },
//   createPasswordChangedToken: function () {
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     this.passwordResetToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     this.passwordResetExpire = Date.now() + 5 * 60 * 1000;
//     return resetToken;
//   },
// };

module.exports = mongoose.model("Product", productSchema);
