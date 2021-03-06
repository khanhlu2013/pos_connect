var base_path = './../';
var lib = require(base_path + 'lib');

describe('group menu execute in sp page', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Group_manage_dlg = require(base_path + 'page/group/Manage_dlg.js');
    var Group_execute_dlg = require(base_path + 'page/group/Execute_dlg.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    
    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can display empty sp warning label',function(){
        lib.auth.login('1','1');
        
        //insert an empty group
        var group_name = 'my group name';
        lib.api_group.insert_empty_group(group_name);

        Sp_page.menu_setting_group();
        Group_manage_dlg.click_col(0,'execute');
        expect(Group_execute_dlg.empty_group_warning_lbl.isDisplayed()).toEqual(true);
    })

    it('can refresh name search data in table',function(){
        lib.auth.login('1','1');
        
        //insert sp
        var product_name = 'product';
        var product_sku = '111';
        var product_price = 1.8;
        var product_crv = 0.2
        var sp = null;
        lib.api.insert_new(product_sku,product_name,product_price,null/*val_cus_price*/,product_crv).then(
            function(create_sp){
                sp = create_sp;
            }
        )
        //insert an emtpy group
        var group = null;
        lib.api_group.insert_empty_group('group name').then(
            function(create_group){
                group = create_group;
            }
        )
        //assoc group and sp
        browser.wait(function(){
            return group !== null && sp !== null;
        }).then(
            function(){
                group.sp_lst = [sp];
                lib.api_group.edit_group(group,group.id);
            }
        )

        Sp_page.sku_search(product_sku);
        Sp_page.menu_setting_group();
        Group_manage_dlg.click_col(0,'execute');

        //enable field
        Group_execute_dlg.enable_field('price',true);
        Group_execute_dlg.enable_field('crv',true);
        Group_execute_dlg.enable_field('cost',true);
        Group_execute_dlg.enable_field('p_type',true);
        Group_execute_dlg.enable_field('p_tag',true);
        Group_execute_dlg.enable_field('vendor',true);
        Group_execute_dlg.enable_field('buydown',true);
        Group_execute_dlg.enable_field('value_customer_price',true);
        Group_execute_dlg.enable_field('is_taxable',true);
        Group_execute_dlg.enable_field('is_sale_report',true);
        
        //execute data
        var new_price = 1.1;
        var new_crv = 2.2;
        var new_cost = 3.3;
        var new_p_type = 'p_type';
        var new_p_tag = 'p_tag';
        var new_vendor = 'vendor';
        var new_buydown = 0.5;
        var new_value_customer_price = 2;
        var new_is_taxable = true;
        var new_is_sale_report = false;

        //set field
        Group_execute_dlg.set_field('price',new_price);
        Group_execute_dlg.set_field('crv',new_crv);
        Group_execute_dlg.set_field('cost',new_cost);
        Group_execute_dlg.set_field('p_type',new_p_type);
        Group_execute_dlg.set_field('p_tag',new_p_tag);
        Group_execute_dlg.set_field('vendor',new_vendor);
        Group_execute_dlg.set_field('buydown',new_buydown);
        Group_execute_dlg.set_field('value_customer_price',new_value_customer_price);
        Group_execute_dlg.set_field('is_taxable',new_is_taxable);
        Group_execute_dlg.set_field('is_sale_report',new_is_sale_report);        

        Group_execute_dlg.ok();
        Alert_dlg.ok();
        Group_execute_dlg.exit();
        Group_manage_dlg.exit();        

        // verify the page is updated
        expect(Sp_page.get_col(0,'price')).toEqual(lib.currency(new_price));
        expect(Sp_page.get_col(0,'crv')).toEqual(lib.currency(new_crv));
        expect(Sp_page.get_col(0,'is_taxable')).toEqual(new_is_taxable);
        expect(Sp_page.get_col(0,'cost')).toEqual(lib.currency(new_cost));
        expect(Sp_page.get_col(0,'is_sale_report')).toEqual(new_is_sale_report);
        expect(Sp_page.get_col(0,'p_type')).toEqual(new_p_type);
        expect(Sp_page.get_col(0,'p_tag')).toEqual(new_p_tag);
        expect(Sp_page.get_col(0,'vendor')).toEqual(new_vendor);
        expect(Sp_page.get_col(0,'buydown')).toEqual(lib.currency(new_buydown));
        expect(Sp_page.get_col(0,'value_customer_price')).toEqual(lib.currency(new_value_customer_price));
    })
});