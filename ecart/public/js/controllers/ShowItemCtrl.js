<div class="container" ng-controller="ShowItemController">
  <div class=" col-lg-2 list-group-info">
       <div class="row">
       		<a ui-sref="#" class="list-group-item active ">{{sideMenu.name}}</a>
       		<div data-ng-repeat="subMenu in sideMenu.sub">
	    		<a ui-sref=".order" class="list-group-item collapsed" data-toggle="collapse" data-target="#collapse-{{$index}}">{{subMenu.name}}</a>
	    		<div class="collapse in" id="collapse-{{$index}}" style="border:1px solid rgb(236, 234, 234)">
		           <ul class="nav nav-list" data-ng-repeat="superSubMenu in subMenu.supersub">
		              <li><a href="" style="font-size: smaller;" ng-click="searchItems(superSubMenu.name)">{{superSubMenu.name}}</a></li>
		           </ul>
		        </div>
	        </div> 
	          
       </div>
       <div class="row">
       <a ui-sref="#" class="list-group-item active ">Brands</a>
    		<a ui-sref=".order" class="list-group-item collapsed" data-toggle="collapse" data-target="#toggleDemo">Masala</a>
			<a ui-sref=".order" class="list-group-item collapsed" data-toggle="collapse" data-target="#toggleDemo2">Snacks</a>
			 <a ui-sref=".order" class="list-group-item collapsed" data-toggle="collapse" data-target="#toggleDemo3">Snacks</a>
			
       </div>
   </div>
	
    <div id="products" class="row list-group">
   		<div class="item  col-xs-3 col-lg-3" data-ng-repeat="item in showItemList">
            <div class="thumbnail">
             
                <img class="group list-group-image" src="temp_upload/{{item.imageId}}" alt="" />
                <div class="caption">
                <h4 class="group inner list-group-item-heading">{{item.name}}</h4>
               
                 <div class="row">
                      <div class="col-xs-12 col-md-7">
                         <h4 >{{amount.selected.Price}}  Rs.</h4>  
                      </div>
                     
                      <div class="col-xs-12 col-md-5">
                           <!-- <select  class="form-control input-sm" ng-change="onChangeAmount()">
                                                <option data-ng-repeat="amtPrice in item.amountprice">{{amtPrice.Amount}}</option>
                                     </select> -->
                                     <select class="form-control input-sm" ng-init="amount.selected=item.amountprice[0]"
                                          ng-model="amount.selected"
                                          ng-options="amtPrice.Amount for amtPrice in item.amountprice">
                                      </select>
                                     </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-6 col-md-2 col-sm-1">
                            <button class="btn btn-xs btn-warning">Description</button>
                      </div>
                      <div ng-hide="isSelected(amount.selected)">
                             <div class="col-lg-2 col-md-2 col-sm-1"">
                               <p>Qty</p> 
                             </div>
                             <div class="col-lg-4 col-md-2 col-sm-1">
                                   <select class="form-control input-sm"
                                          ng-init="quantity.selected=quantityList[0]"
                                          ng-model="quantity.selected"
                                          ng-options="qnt.quantity for qnt in quantityList">
                                               </select>
                             </div>
                      </div>
                  </div>
                  <div class="row">
                     <div class="col-xs-12 col-md-6" ng-hide="isSelected(amount.selected)">
                                           <button class="btn btn-xs btn-success add-to-cart" data-ng-click="addToCart(amount.selected,quantity.selected,item)">Add to Cart</button>
                                           
                      </div>
                      <div class="input-group"  ng-show="isSelected(amount.selected)">
                                     <span class="input-group-btn">
                                         <button type="button" class="btn btn-sm btn-warning btn-number" data-ng-click="counterMinus()"  data-type="minus" data-field="quant[2]">
                                           <span class="glyphicon glyphicon-minus"></span>
                                         </button>
                                     </span>
                                    <input type="text" name="quant[2]" class="form-control input-sm input-number" ng-model="qnt" ng-init="initQnt()" min="1" max="100">
                                   
                                     <span class="input-group-btn">
                                         <button type="button" class="btn btn-sm btn-success btn-number" data-ng-click="counterPlus()" data-type="plus" data-field="quant[2]">
                                             <span class="glyphicon glyphicon-plus"></span>
                                         </button>
                                     </span>
                                 </div>
                  </div>
                </div>
            </div>
        </div>
     </div>
</div>
