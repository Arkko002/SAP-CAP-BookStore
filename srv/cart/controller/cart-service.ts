import cds from "@sap/cds";
import { CartRepository } from "../repository/cart-repository";
import { Cart, CartItem } from "#cds-models/bookstore";
import { CartItemRepository } from "../repository/cart-item-repository";

// TODO: Validation of cart / products between processing steps strategy
export class CartService extends cds.ApplicationService {
  private cartRepository: CartRepository = new CartRepository();
  private cartItemRepository: CartItemRepository = new CartItemRepository();

  async init(): Promise<void> {
    this.on("addToCart", async (req) => {
      const { bookId, userId, quantity: addedQuantity, price } = req.data;
      const cart: Cart = await this.cartRepository.findOne({ ID: bookId });

      const cartItemExisting: CartItem | undefined = cart.items.find(
        (cartItem: CartItem) => cartItem.ID === bookId,
      );

      if (cartItemExisting) {
        await this.cartItemRepository.update(
          { ID: cartItemExisting.ID },
          { quantity: cartItemExisting.quantity + addedQuantity },
        );
      }

      await this.cartItemRepository.create({
        cart_ID: cart.ID,
        item_ID: bookId,
        quantity: addedQuantity,
        price,
      });

      await this.emit("cartUpdated", {
        userId,
        itemId: bookId,
        quantity: addedQuantity,
        operation: "added",
      });
    });

    this.on("removeFromCart", async (req) => {
      const { bookId, userId, quantity: removedQuantity, price } = req.data;
      const cart: Cart = await this.cartRepository.findOne({ ID: bookId });

      const cartItemExisting: CartItem | undefined = cart.items.find(
        (cartItem: CartItem) => cartItem.ID === bookId,
      );

      if (cartItemExisting) {
        const quantityNew: number = cartItemExisting.quantity - removedQuantity;

        if (quantityNew > 0) {
          await this.cartItemRepository.update(
            { ID: cartItemExisting.ID },
            { quantity: quantityNew },
          );
        }

        await this.cartItemRepository.delete({
          cart_ID: cart.ID,
          item_ID: bookId,
        });
      } else {
        // TODO: Logging, monitoring strategy
        console.log(
          `Cannot remove non-existent item from cart ID: ${cart.ID}, item ID: ${bookId}`,
        );
      }

      await this.emit("cartUpdated", {
        userId,
        itemId: bookId,
        quantity: removedQuantity,
        operation: "removed",
      });
    });
  }
}

