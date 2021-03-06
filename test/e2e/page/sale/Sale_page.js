var base_path = './../../';
var lib = require(base_path + 'lib');

var Sale_page = function () {

    //menu
    this.menu_report = element(by.id('sale_app/menu/report'));
    this.menu_setting = element(by.id('sale_app/menu/setting'));
    this.menu_action = element(by.id('sale_app/menu/action'));

    //txt
    this.scan_txt = element(by.id('sale_app/main_page/scan_txt'));

    //btn
    this.tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    this.change_btn = element(by.id('sale_app/main_page/change_btn'));
    this.void_btn = element(by.id('sale_app/main_page/void_btn'));
    this.shortcut_btn = element(by.id('sale_app/main_page/shortcut_btn'));
    //table
    this.lst = element.all(by.repeater('ds in ds_lst'));

    //function menu
    this.menu_report_receipt = function(){
        lib.click(this.menu_report);
        lib.click(element(by.id('sale_app/menu/report/receipt')));
        lib.wait_for_block_ui();
    }
    this.menu_report_sale = function(){
        lib.click(this.menu_report);
        lib.click(element(by.id('sale_app/menu/report/sale')));
        lib.wait_for_block_ui();        
    }
    this.menu_setting_tax = function(){
        lib.click(this.menu_setting);
        lib.click(element(by.id('sale_app/menu/setting/tax')));
    }
    this.menu_setting_group = function(){
        lib.click(this.menu_setting);
        lib.click(element(by.id('sale_app/menu/setting/group')));
    }
    this.menu_setting_payment_type = function(){
        lib.click(this.menu_setting);
        lib.click(element(by.id('sale_app/menu/setting/payment_type')));
    }
    this.menu_setting_shortcut = function(){
        lib.click(this.menu_setting);
        lib.click(element(by.id('sale_app/menu/setting/shortcut')));
    }
    this.menu_setting_mix_match = function(){ 
        lib.click(this.menu_setting); 
        lib.click(element(by.id('sale_app/menu/setting/mix_match'))); 
    }
    this.menu_action_non_inventory = function(){
        lib.click(this.menu_action);
        lib.click(element(by.id('sale_app/menu/action/non_inventory')));
    }    
    this.menu_action_hold = function(){
        lib.click(this.menu_action);
        lib.click(element(by.id('sale_app/menu/action/hold')));
    }
    this.menu_action_get_hold = function(){
        lib.click(this.menu_action);
        lib.click(element(by.id('sale_app/menu/action/get_hold')));
    }
    this.menu_action_sync = function(){
        lib.click(this.menu_action);
        lib.click(element(by.id('sale_app/menu/action/sync')));
        lib.wait_for_block_ui();
    }
    this.menu_action_toogle_value_customer_price = function(){
        lib.click(this.menu_action);
        lib.click(element(by.id('sale_app/menu/action/toogle_value_customer_price')))
    }
    //function btn
    this.shortcut = function(){
        lib.click(this.shortcut_btn);
    }
    this.void = function(){ 
        lib.click(this.void_btn) 
    }
    this.tender = function(){ 
        lib.click(this.tender_btn); 
    }

    //function txt
    this.scan = function(str){
        this.scan_txt.clear();
        this.scan_txt.sendKeys(str,protractor.Key.ENTER); 
        lib.wait_for_block_ui();
    }

    //function table
    this.get_col_index = function(col_name){
        if(col_name === 'qty')          { return 0; }
        else if(col_name === 'name')    { return 1; }
        else if(col_name === 'crv')    { return 2; }
        else if(col_name === 'price')   { return 3; }
        else if(col_name === 'delete')  { return 4; }
        else                            { return -1; }
    }
    this.click_col = function(index,col_name){
        var col = this.get_col_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col));
    }
    this.get_col = function(index,col_name){
        var col = this.get_col_index(col_name); 
        return this.lst.get(index).all(by.tagName('td')).get(col).getText(); 
    }
    this.get_col_html = function(index,col_name){
        var col = this.get_col_index(col_name); 
        return this.lst.get(index).all(by.tagName('td')).get(col).getWebElement().getInnerHtml();      
    }

    //function misc
    this.visit_product = function(){
        var url = 'http://127.0.0.1:8000';
        browser.get(url);
        lib.wait_for_block_ui();           
    }
    this.visit = function(is_offline){
        var posUrl
        if(is_offline === true)  {posUrl = 'http://127.0.0.1:8000/sale/index_offline_angular';}
        else                     {posUrl = 'http://127.0.0.1:8000/sale/index_angular';}
        browser.get(posUrl);
        lib.wait_for_block_ui();               
    }
}

module.exports = new Sale_page();
