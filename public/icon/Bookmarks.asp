<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://localhost">
<html class=" js cssanimations csstransitions" xmlns="http://localhost">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="./ESUN_Data/icon/main.css">
    <style type="text/css">
        .auto-style1 {
            width: 10px;
            text-align: center;
        }
        .auto-style2 {
            text-align: left;
            padding-left: 80px;
            
        }
        .auto-style6 {
            font-size: medium;
        }
        .auto-style7 {
            width: 33%;
            font-weight: bold;
            padding-top:0px;
        }
        .auto-style8 {
            color: #0000FF;
        }

        .auto-style8:hover {
            color:#008000;
            background-image: linear-gradient(white, yellow, white, orange);
            cursor:pointer;
        }
                   
    </style>
</head>
<script language="JavaScript" src="http://172.31.5.42/ESUN_Data/icon/ovuongquay.js" type="text/javascript"></script>

<script>
    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        var first = new Date(today.getFullYear(), 0, 1);
        var theDay = Math.round(((today - first) / 1000 / 60 / 60 / 24) + .5, 0);
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('thoigian').innerHTML = h + ":" + m + ":" + s + " - Today is " + theDay + (theDay == 1 ? "st" : (theDay == 2 ? "nd" : (theDay == 3 ? "rd" : "th"))) + " day of " + today.getFullYear();
        var t = setTimeout(startTime, 1000);
    }
    function checkTime(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }
</script>

<!--**doan script show menu**--
<SCRIPT type=text/javascript>

    /***********************************************
    * Pop-it menu- © Dynamic Drive (www.dynamicdrive.com)
    * This notice MUST stay intact for legal use
    * Visit http://www.dynamicdrive.com/ for full source code
    ***********************************************/

    var defaultMenuWidth = "650px" //set default menu width.
    var linkset = new Array()

    linkset[0] = '<div align=center> <a href="#"><b>E.SUN Bank Dong Nai</b></a> </div>'
    linkset[0] += '<hr>' //Optional Separator

    linkset[1] = '<div align=center> <a href="#"><b>E.SUN Bank Dong Nai</b></a> </div>'
    linkset[1] += '<hr>' //Optional Separator

    linkset[0] += "<a target='_blank' href='esun_data/Contact_list_esun1.pdf'>001 Contact list of ESUN Bank</a>"
    linkset[0] += "<a target='_blank' href='esun_data/CONTACT_LIST_SUPPLIERS.pdf'>002 Contact list of suppliers</a>"
    linkset[0] += "<a target='_blank' href='esun_data/VNPT.pdf'>003 Telephone Number of VNPT</a>"

    ////No need to edit beyond here

    var ie5 = document.all && !window.opera
    var ns6 = document.getElementById

    if (ie5 || ns6)
        document.write('<div id="popitmenu" onMouseover="clearhidemenu();" onMouseout="dynamichide(event)"></div>')

    function iecompattest() {
        return (document.compatMode && document.compatMode.indexOf("CSS") != -1) ? document.documentElement : document.body
    }

    function showmenu(e, which, optWidth) {
        if (!document.all && !document.getElementById)
            return
        clearhidemenu()
        menuobj = ie5 ? document.all.popitmenu : document.getElementById("popitmenu")
        menuobj.innerHTML = which
        menuobj.style.width = (typeof optWidth != "undefined") ? optWidth : defaultMenuWidth
        menuobj.contentwidth = menuobj.offsetWidth
        menuobj.contentheight = menuobj.offsetHeight
        eventX = ie5 ? event.clientX : e.clientX
        eventY = ie5 ? event.clientY : e.clientY
        //Find out how close the mouse is to the corner of the window
        var rightedge = ie5 ? iecompattest().clientWidth - eventX : window.innerWidth - eventX
        var bottomedge = ie5 ? iecompattest().clientHeight - eventY : window.innerHeight - eventY
        //if the horizontal distance isn't enough to accomodate the width of the context menu
        if (rightedge < menuobj.contentwidth)
        //move the horizontal position of the menu to the left by it's width
            menuobj.style.left = ie5 ? iecompattest().scrollLeft + eventX - (menuobj.contentwidth / 2) + "px" : window.pageXOffset + eventX - (menuobj.contentwidth / 2) + "px"
        else
        //position the horizontal position of the menu where the mouse was clicked
            menuobj.style.left = ie5 ? iecompattest().scrollLeft + eventX + "px" : window.pageXOffset + eventX + "px"
        //same concept with the vertical position
        if (bottomedge < menuobj.contentheight)
            menuobj.style.top = ie5 ? iecompattest().scrollTop + eventY - menuobj.contentheight + "px" : window.pageYOffset + eventY - menuobj.contentheight + "px"
        else
            menuobj.style.top = ie5 ? iecompattest().scrollTop + event.clientY + "px" : window.pageYOffset + eventY + "px"
        menuobj.style.visibility = "visible"
        return false
    }

    function contains_ns6(a, b) {
        //Determines if 1 element in contained in another- by Brainjar.com
        while (b.parentNode)
            if ((b = b.parentNode) == a)
                return true;
        return false;
    }

    function hidemenu() {
        if (window.menuobj)
            menuobj.style.visibility = "hidden"
    }

    function dynamichide(e) {
        if (ie5 && !menuobj.contains(e.toElement))
            hidemenu()
        else if (ns6 && e.currentTarget != e.relatedTarget && !contains_ns6(e.currentTarget, e.relatedTarget))
            hidemenu()
    }

    function delayhidemenu() {
        delayhide = setTimeout("hidemenu()", 500)
    }

    function clearhidemenu() {
        if (window.delayhide)
            clearTimeout(delayhide)
    }

    if (ie5 || ns6)
        document.onclick = hidemenu
</SCRIPT>
<!--**ket thuc script**-->

<BODY leftMargin=10 background=ESUN_Data/icon/bg.gif onload="startTime()">
<div id="full">
<div id="wraper_full">
<div class="banner"> <span class="text">E.SUN DONG NAI BOOKMARKS</span></div>
	<table class="table_top">
        <tr>
            <td class="table_top_1">
				<marquee width = "100%" OnMouseOver="this.stop();" OnMouseOut="this.start();" scrollamount="3">
                Don't open phishing email and malicious websites.  Shutdown computer before leaving.  Check In/Out everyday. !!! 
                </marquee>
            </td>
            <td class="table_top_2" id="thoigian"></td>
        </tr> 
    </table>
    
<div id="main">
	<div class="left">
        <div class="box1"><h1><span class="menu_text">COMPLIANCE/AML</span></h1></div>
    	<div class="box">
			<ul>
                <li> <a href="https://www.moodys.com/credit-ratings/Vietnam-JSC-Bank-for-Industry-and-Trade-credit-rating-820956665" target=_blank>Moody</a></li>
                <!--<li> <a href="https://www.acamsra.com/login" target=_blank>ACAMS-Risk Assessment</a></li>-->
                <!--<li> <a href="https://eamlvwp.esunbank.com.tw:9444/FCVW/login/" target=_blank>E-AML Swift</a></li>-->
				<li> <a href="http://10.240.101.28:8080/EsunCMT/#/login" target=_blank>G-AML</a></li>
				<li> <a href="https://namescan.io/FreePEPCheck.aspx" target=_blank>Scan Name - PEP</a></li>
				<li> <a href="http://bocongan.gov.vn/truy-na/doi-tuong-truy-na.html?search=ad&Keyword=tr%E1%BA%A7n%20v%C4%83n%20th%C3%A0nh" target=_blank>Ministry of Public Security</a></li>		
                <li> <a href="https://ips.esunbank.com.tw/IPSearch" target=_blank>Check Counter Party</a></li>
                <li> <a href="https://rmsweb.esunbank.com.tw/Eng/OverseasLaw" target=_blank>RMS (regulations)</a></li>
                <li> <a href="https://samlcmtwebp.esunbank.com.tw:8443/cmt/" target=_blank>SAML</a></li>
                <li> <a href="https://esgarden.esunbank.com.tw/personal/esb20642/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fesb20642%2FDocuments%2FOverseas%20Units%20Shared%20Drive" target=_blank>AML Onedrive</a></li>
                <li> <a href="https://doanhnghiepmoi.vn/" target=_blank>Search Business Information</a></li>
				<li> <a href="https://cpms.esunbank.com.tw/" target=_blank>CPMS</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></li>
 			</ul>
        </div>
    </div>
    <div class="left">
        <div class="box1"><h1><span class="menu_text">OPERATION</span></h1></div>
    	<div class="box">
			<ul>
				<li> <a href="https://est24p.esunbank.com.tw/VN/servlet/BrowserServlet" target=_blank>T24 Production</a></li>
				<li> <a href="https://fptsp.esunbank.com.tw/" target=_blank>SBRS System</a></li>
				<li> <a href="https://citad.esunbank.com.tw/CITAD/Modules/Login/frmLogin.aspx" target=_blank>Citad System</a></li>
				<li> <a href="https://ipcp.esunbank.com.tw/" target=_blank>IPC Production</a></li>
				<li> <a href="https://vnsealad00p01:8443/nibox/" target=_blank>Sealquery</a></li>
				<li> <a href="https://www.dowjones.com/products/" target=_blank>DowJones</a></li>
                <li> <a href="https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx" target=_blank>Business Registration</a></li>               
                <li> <a href="https://ssoext.sbv.gov.vn/oam/server/obrareq.cgi?encquery%3Da1MxGS7A8NDHpcgWX5W7oaKhWU1gNgdsUoVHfmc4K5yPGPA23K6irDKdeCSF%2FS58Fu%2BxlhcHaQ1wgtJt4deJEeeg3hE6OOJGllwmaihhY0Gra08gpXXfi%2FDHGhPIks4DpwULLN78Sywz8hgvkXxtu3RCn8Z7ftQdjHpO%2BBA9AU3eP6%2B9h4Va4aKSXwsgtwhi4FDmKW6chKjU%2BVdn4GIda5h4ih2u6iLhWm%2BVzsD%2F%2FVko5GjIcq4EMkhsskPiokXouZRgmmQ6RQODhif7DY7TozhMiP%2Bgndpgwhj88cUt%2Fb9U%2BbyhzdolwzI%2Fqm0MdeUTdO9X7%2BRlirNsO9fOVjyOcHBTWoPdUyxH1git%2B68eDiQ%3D%20agentid%3DSG4Webgate%20ver%3D1%20crmethod%3D2&ECID-Context=1.005NtBwVwxN6yG15zvS4yW0003m9000SYD%3BkXjE#/view/login" target=_blank>SBV Portal</a></li>
                <li> <a href="https://eamlvwp.esunbank.com.tw:9444/FCVW/login/" target=_blank>Firco Continuity</a></li>
				<li> <a href="https://vnekyc.esunbank.com.tw/admin/login" target=_blank>eKYC - Biometric</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></li>
 			    </ul>
		</div>
    </div>
    <div class="left">
        <div class="box1"><h1><span class="menu_text">CAD, ARM &amp; ACC</span></h1></div>
    	<div class="box">
			<ul>
				<li> <a href="https://corporate.esunbank.com.tw" target=_blank>CPS</a></li>
                <li> <a href="https://cic.org.vn/" target=_blank>CIC</a></li>
                <li> <a href="http://www.div.gov.vn" target=_blank>DIV</a></li>
				<li> <a href="https://vnonep.esunbank.com.tw/ReportPlatform/" target=_blank>Report Management System</a></li>
				<li> <a href="https://vnonep.esunbank.com.tw/GeneralLedger/" target=_blank>General Ledger</a></li>
				<li> <a href="https://ecs.esunbank.com.tw/" target=_blank>ECS</a></li>
				<li> <a href="https://www.customs.gov.vn" target=_blank>Vietnam Customs</a></li>
				<li> <a href="https://dktructuyen.moj.gov.vn/" target=_blank>Online Registration</a></li>
                <li> <a href="https://evisa.xuatnhapcanh.gov.vn/web/guest/dvbl-khong-tai-khoan" target=_blank>Immigration Registration</a></li>
                <li> <a href="https://access.jpmorgan.com/jpmalogon" target=_blank>JPMorgan</a></li>
 			</ul>
        </div>
    </div>
    <div class="left">
        <div class="box1"><h1><span class="menu_text">OTHERS</span></h1></div>
    	<div class="box">
			<ul>
				<li> <a href="https://exchgmbxpv1.esunbank.com.tw/owa/" target=_blank>Email System</a></li>
				<li> <a href="https://ehrd.esunbank.com.tw/ehrd/" target=_blank>E-Learning IT</a></li>
				<li> <a href="https://hrisweb.esunbank.com.tw:8443/psp/HRISP/?cmd=login" target=_blank>E-HR System</a></li>
				<li> <a href="https://www.esunbank.com.tw/bank/personal/deposit/rate/foreign/exchange-market-rate" target=_blank>Exchange-Market-Rate</a></li>
				<li> <a href="http://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp" target=_blank>Searching Tax Code</a></li>
				<li> <a href="https://thuvienphapluat.vn/" target=_blank>The Library of Law</a></li>
                <!--<li> <a href="https://b2e.esunbank.com/vn" target=_blank>Old E-Banking System</a></li>-->
                <li> <a href="https://gibb2e.esunbank.com.tw" target=_blank>New E-Banking System</a></li>
                <li> <a href="https://einvweb.esunbank.com.tw/" target=_blank>Einvoice System</a></li>
                <li> <a href="https://gts-vn-web.esunbank.com.tw/" target=_blank>GTS System</a></li>
				<li> <a href="https://nfc.saas.api-fpt-eid.online/login" target=_blank>ID Check System</a></li>
				<li> <a href="https://eip.esunbank.com.tw/sites/C0042/9100/_layouts/15/start.aspx#/Shared%20Documents/Forms/AllItems.aspx" target=_blank>SharePoint Sites</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></li>
                <!--**ket thuc script**<li> <a href="https://b2e.esunbank.com/vn" target=_blank>E-Banking</a></li> <li> <a href="https://esb.esunbank.com/vn" target=_blank>E-Banking for Customers</a></li> -->
			</ul>
        </div>
    </div>
    <div class="left">
        <div class="box1"><h1><span class="menu_text">FORMS</span></h1></div>
    	<div class="box">
			<ul>
			    <li> <a href="http://172.31.30.13/CITAD/" target=_blank>CITAD DR Site</a></li>
				<li> <a href="http://172.31.30.14:443" target=_blank>SBRS DR Site</a></li>
				<!--<li> <a href="https://citadtemp.esunbank.com.tw/CITAD/Modules/Login/frmLogin.aspx" target=_blank>New Citad</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></li>-->
				<!--<li> <a href="https://rtgsp.esunbank.com.tw/Account/Login" target=_blank>New IPC</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></li>-->
				<li> <a href="http://10.240.201.25:8080/EsunCMT/#/login" target=_blank>AML UAT</a></li>
				<li> <a href="https://www.irs.gov/businesses/corporations/fatca-related-forms" target=_blank>FATCA Form</a></li>
                <li> <a href="http://172.31.5.42/Markets/Forms.asp" target=_blank>E.SUN Form</a></li>
                <li> <a href="https://einvweb.testesunbank.com.tw/" target=_blank>Einvoice System UAT</a></li>
				<li> <a href="https://edoc.esunbank.com.tw/speed30/account/integratelogin?compid=ESUNBANK" target=_blank>E-Document</a></li>
                <li> <a href="https://itsm.sbv.gov.vn" target=_blank>Help Desk SBV</a></li>
				<li> <a href="https://dvc.sbv.gov.vn/" target=_blank>DVC Account of SBV</a></li>
                <li> <a href="https://ssoext.sbv.gov.vn/oam/server/obrareq.cgi?encquery%3DFfyVV5rVK6m8CFhKBwjHr5OjLdW5ozZpUg9ucUl1NA72haj4lwF81lG3XN3oA8vXyilX%2Fmgy0dTweUQsLu%2Be7YmA9PJcd2kwqiMH%2FqwtaN0%2F9T2OCdgZZHEOMUPtHTEIoJ8PVDWB0J26LxybqDBpiB0NMtWwvn5m37rWP7FIF4LOt10A%2FBbGmhKmGvuGQOPX1hY4722h6O1XHohtjm5YJIBTWzdbOp6kbKOn8hGg8tmnZ3aytgOtaiSmKTD5HQwf5qyE6VCsMTvmoyI%2Bv%2FmY7xRC8pYyTDgETk1acF7xOhQ%3D%20agentid%3DWebgate_IDM_11g%20ver%3D1%20crmethod%3D2&ECID-Context=1.005fixfPPD76yG15zvDCiW0002fZ0000U8%3BkXjE" target=_blank>Reset Password on SBV'Website</a></li>
 			</ul>
        </div>
    </div> <br />

    <table class="middle_center">
        <tr class="auto-style6">
            <td class="auto-style7">&nbsp;<img src="http://172.31.5.42/ESUN_Data/icon/Profile.png" style="width: 24px"></img> Contact</td>
            <td rowspan="5" class="auto-style1">&nbsp;<div class="vertical-line" style="height: 110px;"></div></td>
            <td class="auto-style7">&nbsp;<img src="http://172.31.5.42/ESUN_Data/icon/date-24.png" style="height: 24px; width: 24px"></img> Head Office</td>
            <td rowspan="5" class="auto-style1">&nbsp;<div class="vertical-line" style="height: 110px;"></div></td>
            <td class="auto-style7">&nbsp;<img src="http://172.31.5.42/ESUN_Data/icon/LineChart.png" style="width: 24px"></img> Market &amp; News</td>
        </tr>
        <tr>
            <td class="auto-style2"><a href="ESUN_Data/contact/Contact_list_esun.pdf" target=_blank class="auto-style8">Employees</a> |
            <a href="ESUN_Data/contact/VNPT.pdf" target=_blank class="auto-style8">VNPT Supliers</a></td>
            <td class="auto-style2"><a href="https://eip.esunbank.com.tw/" target=_blank class="auto-style8">EIP</a> |
			<a href="https://ifsp.oa.esunbank.com.tw/Genie" target=_blank class="auto-style8">Genie v2.9</a><img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></td>
            <td class="auto-style2"><a href="http://172.31.5.42/Markets/ExchangeRate.aspx/" target=_blank class="auto-style8">Exchange Rate</a> <img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></td>
        </tr
		<tr>
            <td class="auto-style2"><a href="ESUN_Data/contact/CONTACT_LIST_SUPPLIERS.pdf" target=_blank class="auto-style8">Contact list of suppliers</a></td>
            <td class="auto-style2"><a href="https://www.esunbank.com.tw" target=_blank class="auto-style8">Main Webite</a></td>
            <td class="auto-style2"><a href="http://172.31.5.42/Markets/DepositInterestRate.aspx/" target=_blank class="auto-style8">Deposit Interest Rate</a></td>
        </tr>
        <tr>
            <td class="auto-style2"><a href="ESUN_Data/contact/Telephone_Diagram.pdf" target=_blank class="auto-style8">Map of E.SUN</a> <img src="http://172.31.5.42/ESUN_Data/icon/new.gif" style="height: 15px; width: 35px"></td>
            <td class="auto-style2"><a href="https://oaportal.esunbank.com.tw/" target=_blank class="auto-style8">OA Website</a></td>
            <td class="auto-style2"><a href="http://172.31.5.42/News/News.asp" target=_blank class="auto-style8"  >IT Training & Internal Broadcast News</a></td>
        </tr>
    </table> <br />
</div>
    <div class="bottom_end">
        <a href="#home"><img src="http://172.31.5.42/ESUN_Data/icon/footer_logo.png"  style="height: 45px; margin-top: 20px"></a>
        <c >Address: R101, R209 Amata Trade Center, Long Binh Ward, Dong Nai Province <br />
        Tel: (+84) 251.367 1313 - Fax: (+84) 251. 3936 317 - Swiftcode: ESUNVNVX<br />
        Designed by HuyCuong - Copyright © <span id="currentYear"></span></c>
		<script>
			var currentYear=new Date().getFullYear();
			document.getElementById("currentYear").textContent=currentYear;
		</script>
    </div>
</div>
</div>
</body>
</html>