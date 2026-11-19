/**
 * DealHunter restaurant directory.
 * Logos use authentic SVGs or high-resolution brand assets, not favicons.
 * For production, mirror approved originals in /public/logos and change
 * the `logo` URLs to local paths to avoid third-party image outages.
 */
export type RestaurantCategory='Fast food'|'Coffee & tea'|'Pizza'|'Desserts & dining'|'Convenience';
export type RestaurantBrand={
  name:string;
  category:RestaurantCategory;
  website:string;
  logo:string;
  logoBackground?:string;
  tagline:string;
};

export const restaurantBrands:RestaurantBrand[]=[
  {name:'McDonald’s',category:'Fast food',website:'https://www.mcdonalds.com.my/',logo:'/logos/mcdonalds.svg',logoBackground:'#d90017',tagline:'Burgers, sides & more'},
  {name:'KFC',category:'Fast food',website:'https://kfc.com.my/',logo:'https://upload.wikimedia.org/wikipedia/commons/5/5d/KFC_2026_%28wordmark%29.svg',tagline:'Finger lickin’ favourites'},
  {name:'Marrybrown',category:'Fast food',website:'https://marrybrown.com/',logo:'https://cdn.brandfetch.io/idAzaw3Trn/w/3508/h/2481/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1776487627902',tagline:'Malaysian comfort food'},
  {name:'Burger King',category:'Fast food',website:'https://www.burgerking.com.my/',logo:'/logos/burgerking.svg',tagline:'Flame-grilled favourites'},
  {name:'Pizza Hut',category:'Pizza',website:'https://www.pizzahut.com.my/',logo:'https://upload.wikimedia.org/wikipedia/commons/c/c5/Pizza_Hut_2025.svg',tagline:'Pizza and sides'},
  {name:'Domino’s Pizza',category:'Pizza',website:'https://www.dominos.com.my/',logo:'https://upload.wikimedia.org/wikipedia/commons/9/91/Domino%27s_2025_%28symbol%29.svg',tagline:'Pizza, sides & desserts'},
  {name:'ZUS Coffee',category:'Coffee & tea',website:'https://zuscoffee.com/',logo:'https://zuscoffee.com/wp-content/uploads/2026/06/Logo-Footer.svg',logoBackground:'#233b83',tagline:'Your everyday coffee'},
  {name:'Tealive',category:'Coffee & tea',website:'https://www.tealive.com.my/',logo:'https://cdn.brandfetch.io/id3lswLeDR/w/3255/h/834/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1790585894655',tagline:'Milk tea & fresh drinks'},
  {name:'CHAGEE',category:'Coffee & tea',website:'https://chagee.com.my/',logo:'https://companieslogo.com/img/orig/CHA_BIG-5cfb9c0c.svg',tagline:'Modern tea drinks'},
  {name:'Starbucks',category:'Coffee & tea',website:'https://www.starbucks.com.my/',logo:'/logos/starbucks.svg',tagline:'Coffee & more'},
  {name:'The Coffee Bean & Tea Leaf',category:'Coffee & tea',website:'https://www.coffeebean.com.my/',logo:'https://images.deliveryhero.io/image/fd-my/my-logos/cr6ub-logo.jpg',tagline:'Coffee, tea & treats'},
  {name:'FamilyMart',category:'Convenience',website:'https://www.familymart.com.my/',logo:'https://cdn.brandfetch.io/idmayRRNod/w/497/h/73/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1789153229347',tagline:'Snacks, desserts & more'},
  {name:'Subway',category:'Fast food',website:'https://www.subway.com/en-my/',logo:'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg',tagline:'Freshly made sandwiches'},
  {name:'Sushi King',category:'Desserts & dining',website:'https://sushi-king.com/',logo:'https://www.sunwayvelocitymall.com/static/shops/a04d8ff4032d55fb8f8ddcd771dd2210/w768.png',tagline:'Japanese favourites'},
  {name:'Secret Recipe',category:'Desserts & dining',website:'https://www.secretrecipe.com.my/',logo:'https://upload.wikimedia.org/wikipedia/commons/2/26/Secret_Recipe_Logo.png',logoBackground:'#fff',tagline:'Cakes, meals & desserts'}
];

export function restaurantKey(name:string){
  return name.toLowerCase().normalize('NFKD').replace(/[’‘']/g,'').replace(/[^a-z0-9]/g,'');
}
export function restaurantByName(name:string):RestaurantBrand|undefined{
  return restaurantBrands.find(restaurant=>restaurantKey(restaurant.name)===restaurantKey(name));
}
