var base_path = './../../'
var lib = require(base_path + 'lib');

var Sp_info_dlg = function () {

    //tab 
    this.main_tab = element(by.id('sp_app/service/info/tab/sp'));  
    this.sku_tab = element(by.id('sp_app/service/info/tab/sku'));   
    this.kit_tab = element(by.id('sp_app/service/info/tab/kit'));  
    this.group_tab = element(by.id('sp_app/service/info/tab/group')); 
    this.network_product_tab = element(by.id('sp_app/service/info/tab/network_product'));
    
    //btn
    this.edit_btn = element(by.id('sp_app/service/info/edit_btn'));    
    this.exit_btn = element(by.id('sp_app/service/info/exit_btn'));
    this.get_network_product_btn = element(by.id('sp_app/service/info/tab/network_product/get_btn'));
    this.duplicate_btn = element(by.id('sp_app/service/info/duplicate_btn'));

    //table
    this.group_lst = element.all(by.repeater('group_info in sp.group_lst'));

    //button function
    this.edit = function(){ 
        lib.click(this.edit_btn); 
    }
    this.exit = function(){ 
        lib.click(this.exit_btn); 
    }
    this.duplicate = function(){
        lib.click(this.duplicate_btn);
    }
    
    this.switch_tab = function(tab_name){
        if(tab_name === 'main')                     { lib.click(this.main_tab); }
        else if(tab_name === 'group')               { lib.click(this.group_tab); }
        else if(tab_name === 'kit')                 { lib.click(this.kit_tab); }
        else if(tab_name === 'sku')                 { lib.click(this.sku_tab); }
        else if(tab_name === 'network_product')     { lib.click(this.network_product_tab); }
    }

}

module.exports = new Sp_info_dlg();
