import {computed, action, observable} from "mobx";
import ShopInfoModel from "../model/ShopInfoModel";

class ShopInfoViewModel {

  @observable shopImgPath = '';
  @observable shopName = '';
  @observable shopPromotion = '';
  @observable footList = [];
  @observable selectIndex = 0;

  getShopData(id, latitude, longitude) {
    ShopInfoModel.fetchShopDetails(id, latitude, longitude).then((res) => {
      this.shopImgPath = res.image_path;
      this.shopName = res.name;
      this.shopPromotion = res.promotion_info
    })
  }

  fetchFootList(shopId){
    ShopInfoModel.fetchShopGoodsList(shopId).then((res)=>{
      let items = [];
      let length = res.length;
      for (let i = 0; i < length; i++) {
        let tempItem = res[i];
        if (tempItem.foods === undefined || tempItem.foods == null || tempItem.foods.length === 0) continue;
        for (let j = 0; j < tempItem.foods.length; j++) {
          tempItem.foods[j].buyNum =  0;
        }
        let item = {
          key: tempItem.name,
          description: tempItem.description,
          restaurant_id: tempItem.restaurant_id,
          id: tempItem.id,
          data: tempItem.foods
        };
        items.push(item)
      }
      this.footList = items
    })
  }

  @action
  addFoodBuyNum(food){
    for (let i = 0; i < this.footList.length; i++) {
      if (this.footList[i].id === food.category_id) {
        let foots = this.footList[i].data;
        for (let j = 0; j < foots.length; j++) {
          if (foots[j].item_id === food.item_id) {
            this.footList[i].data[j].buyNum++;
          }
        }
      }
    }
  }

  @action
  subFoodBuyNum(food){
    for (let i = 0; i < this.footList.length; i++) {
      if (this.footList[i].id === food.category_id) {
        let foots = this.footList[i].data;
        for (let j = 0; j < foots.length; j++) {
          if (foots[j].item_id === food.item_id && foots[j].buyNum > 0) {
            this.footList[i].data[j].buyNum--;
          }
        }
      }
    }
  }

  @computed
  get getShopImgPath() {
    return this.shopImgPath
  }

  @computed
  get getShopName() {
    return this.shopName
  }

  @computed
  get getShopPromotion() {
    return this.shopPromotion
  }

  @computed
  get getFootList(){
    return this.footList.map((v)=>{
      return {
        key: v.key,
        description: v.description,
        restaurant_id: v.restaurant_id,
        id: v.id,
        data: v.data.slice(),
      }
    }).slice();
  }

  @action
  setSelectIndex(index: number){
    this.selectIndex = index
  }

  @computed
  get getSelectIndex(){
    return this.selectIndex
  }
}

const shopInfoViewModel = new ShopInfoViewModel();
export default shopInfoViewModel