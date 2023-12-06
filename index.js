var btnUltimoClick = null;
var nonRicaricare = false;
var cellaCanone = null;

$(document).ready(function() {
    $(".slidingDiv").hide();
	
	$('#bntShowHide').click(function()
	{
		$(".slidingDiv").slideToggle();
	});		
	
	var avviaRicerca = document.frmSearch.avviaRicerca.value;
	
	caricaCommesse();
	if( avviaRicerca == 1 )
		$("#frmSearch :input[name=Commessa]").val(Commessa);
	
	caricaEnte();
	if( avviaRicerca == 1 )
		$("#frmSearch :input[name=IdEnte]").val(IdEnte);
	
	disabledOfferta();
	disabledenableAttiAggiuntivi();
	disabledAnno();
	disabledMese();
	
	disabledBottoni();
	$("#attesaTable").hide();
	
	initDialog();
	initDialogNoteObbligatorie();
	initDialogValidazioneReferente();
}); 

function initDialog(){
	//console.log("initDialog");
	$( "#dialog" ).dialog({
		autoOpen: false,
		//title: "Lista Mestieri",
		title: "",
		modal: true,
		width: 1250,
		height: 500,
		resizable: false,
		position : {
			my: "left top",
			at: "left top",
			of: "#TabRis"
		}
	});
}

function enableMese(){
	$("#frmSearch :input[name=Mese]").prop( "disabled", false );
}

function deselectCheckbox(){
	document.getElementById("con").checked = false;
	document.getElementById("senza").checked = false;
}

function disabledBottoni(){
	$("#frmSearch :input[name=Cerca]").prop( "disabled", true );
	$("#frmSearch :input[name=WORD]").prop( "disabled", true );
	$("#frmSearch :input[name=PDF]").prop( "disabled", true );
	$("#frmSearch :input[name=EXCEL]").prop( "disabled", true );
	$("#frmSearch :input[name=INVIAPDF]").prop( "disabled", true );
	$("#frmSearch :input[name=RESET]").prop( "disabled", true );
	$("#frmSearch :input[name=CSVS400]").prop( "disabled", true );
}

function disabledBottoni_clsl(){
	$("#frmSearch :input[name=WORD]").prop( "disabled", true );
	$("#frmSearch :input[name=PDF]").prop( "disabled", true );
	//$("#frmSearch :input[name=EXCEL]").prop( "disabled", true );
}

/*
function enableBottoni(){
	$("#frmSearch :input[name=Cerca]").prop( "disabled", false );
	$("#frmSearch :input[name=WORD]").prop( "disabled", false );
	$("#frmSearch :input[name=PDF]").prop( "disabled", false );
	$("#frmSearch :input[name=EXCEL]").prop( "disabled", false );
	$("#frmSearch :input[name=INVIAPDF]").prop( "disabled", false );
	$("#frmSearch :input[name=RESET]").prop( "disabled", false );
	$("#frmSearch :input[name=CSVS400]").prop( "disabled", false );
}
*/

function checkAttiAggiuntivi(element){
	var form = document.formScarica;
	if( element.id == "senza") {
		document.getElementById("con").checked = false;
		//$("AA_con").val(0);
		form.AA_con.value = 0;
		form.AA_senza.value = 1;
		//$("AA_senza").val(1);
	} else {
		document.getElementById("senza").checked = false; 
		//$("AA_con").val(1);
		//$("AA_senza").val(0);
		form.AA_con.value = 1;
		form.AA_senza.value = 0;
	}

	if(document.getElementById("senza").checked == true || document.getElementById("con").checked == true){
		$("#frmSearch :input[name=Cerca]").prop( "disabled", true );
	}else{
		$("#frmSearch :input[name=Cerca]").prop( "disabled", false );
	}
}

function startRicerca(opzione, scheda) {
	var form = document.frmSearch;
	
	if(opzione==1) {
		form.action = '';
		form.target = '';
		
		form.soloRicercaAjax.value=1;
		form.avviaRicerca.value=1;
		
		preparaRicercaAjax();
		avviaRicercaAjax();
		
		return;
	}
	else if(opzione==2) {
		if(scheda==1)
			form.action = 'report_ore_excel.php';
		else
			form.action = 'report_ore_excel_2.php';
		
		form.target = 'targetExcel';
	}
	else if (opzione == 5) {
		if (frmSearch.Mail.value && frmSearch.Mail.value !== '') {
			
			frmSearch.Tipologia.value = 5;//Perché devo inviare un PDF
			
			if( Number( frmSearch.AA.value ) <= 0 ){ frmSearch.AA = -1; }
			else{ frmSearch.AA.value = frmSearch.AA.value; }
			
			if( Number( frmSearch.senza.checked ) == 0 ){
				frmSearch.AA_senza = 0;
			}
			else{
				frmSearch.AA_senza.value = frmSearch.senza.checked ? 1 : 0;
			}
			
			if( Number( frmSearch.con.checked ) == 0 ){
				frmSearch.AA_con = 0;
			}
			else{
				frmSearch.AA_con.value = frmSearch.con.checked ? 1 : 0;
			}

			// richiamare funzione che invia email
			
			if(result.state) 
			{
				console.log(result);
				alert(result.message);
			}
			else {
				//console.log("Result: ", result);
				alert("La mail è stata spedita con successo.");
				
				form.soloRicercaAjax.value=0;
				form.avviaRicerca.value=1;
				form.submit();
			}			
		} else {
			alert("Attenzione: non è stata digitata una e-mail.");
		}
	}
}

function preparaRicercaAjax() {   
	//console.log("preparaRicercaAjax");  
	$('#divInner').html("<h1>Ricerca in corso...</h2>").delay(5000);
	$('#msgErrorAvvioRicerca').remove();  	
}

function ResizeTextArea(txtarea) {
	var tx = $(txtarea);
	
	if ( tx.attr('Massimizzata')==0 )
		tx.attr('rows',10).attr('cols',80).attr('Massimizzata',1);
	else
		tx.attr('rows',1).attr('cols',20).attr('Massimizzata',0);
}
 
function Modifica(txt) {
	var tx = $(txt);
	var value;
	
	switch(tx.attr('type')) {
		case "checkbox":
			value = tx.attr('checked') ? 1 : 0;
			break;
		case "textarea":
		default:
			value = tx.val();
			break;
	}
	
	var Campo = tx.attr('Campo');
	
	var obj = { 
		Commessa: tx.attr('Commessa'),
		IdEdificio: tx.attr('IdEdificio'),
		IdOfferta: tx.attr('IdOfferta'),
		meseSelezionato: tx.attr('meseSelezionato'),
		annoSelezionato: tx.attr('annoSelezionato'),
		IdMestiere: tx.attr('IdMestiere'),
		StoricoRendiconto: document.frmSearch.StoricoRendiconto.value,
		unitaG: document.frmSearch.unitaG.value,
		gruppiMes: document.frmSearch.gruppiMes.value,
		istat: document.frmSearch.istat.value,
		Campo: Campo,
		value: value
	};
	
	var refreshTot = document.frmSearch.refreshTot.value;
	var NoteObbligatorie = document.frmSearch.NoteObbligatorie.value;
	var NoteInterneObbl = document.frmSearch.NoteInterneObbl.value;
	//console.log(isNaN(cellaCanone));
	
	
	if(obj.value !== cellaCanone){
			
		if(NoteObbligatorie == 1){
			apriDialogNoteObbligatorie( obj );		
		}
		
		//console.log(NoteInterneObbl + " " + obj.Campo);
		if(NoteInterneObbl == 1 && obj.Campo == 'CanoneMensile'){
			apriDialogNoteInterne( obj );		
		}
		
		//richiama funzione che salva le informazioni

		if(result.state) {
			alert(result.message);
		}
		else {
			switch(tx.attr('TipoInput')) {
				case 'n':
					//result.value = result.value ? Number(result.value).toLocaleString('it-IT', {minimumFractionDigits: 2}) : '';
					result.value = Number(result.value).toLocaleString('it-IT', {minimumFractionDigits: 2});
					break;
				default:
					break;
			}

			switch(tx.attr('type')) {
				case "textarea":
					tx.val(result.value);
					break;
				default:
					tx.attr('value', result.value);
					break;
			}
			//console.log(refreshTot);
			if(refreshTot == 0){	
				avviaRicercaAjax();
			}
		}
	}
}

function ModificaNoteIncrementoIstat (input) {
	var x = $(input);
	
	var value;
	
	var obj = {
		Commessa: x.attr('Commessa'),
		IdOfferta: x.attr('IdOfferta'),
		meseSelezionato: x.attr('meseSelezionato'),
		annoSelezionato: x.attr('annoSelezionato'),
		IdEdificio: x.attr('IdEdificio'),
		Note: x.val()
	}
}

function manageCSV(index){
	//console.log("manageCSV: " + index);
	if( Number( frmSearch.AA.value ) <= 0 ){ formScaricaCSVS400.AA = -1; }
	else{ formScaricaCSVS400.AA.value = frmSearch.AA.value; }
	
	formScaricaCSVS400.Commessa.value = frmSearch.Commessa.value;
	formScaricaCSVS400.IdOfferta.value = frmSearch.IdOfferta.value;

	if( Number( frmSearch.senza.checked ) == 0 ){
		formScaricaCSVS400.AA_senza = 0;
	}
	else{
		formScaricaCSVS400.AA_senza.value = frmSearch.senza.checked ? 1 : 0;
	}
	
	if( Number( frmSearch.con.checked ) == 0 ){
		formScaricaCSVS400.AA_con = 0;
	}
	else{
		formScaricaCSVS400.AA_con.value = frmSearch.con.checked ? 1 : 0;
	}
	
	formScaricaCSVS400.Mese.value = frmSearch.Mese.value;
	formScaricaCSVS400.Anno.value = frmSearch.Anno.value;
	formScaricaCSVS400.Mail.value = frmSearch.Mail.value;
	
	formScaricaCSVS400.Tipologia.value = index;
	
	formScaricaCSVS400.submit();
}

function sendCSVViaFTP(){
	
	result = jhp("jhp/csv/sendCSVViaFTP.php", {} );
	
	if (result.state) {
		alert(result.message);
	}
}

function manageExcel(obj) {
	result = jhp("jhp/creazioneExcel/default.php", obj); 
	if (result.state) 
	{
		alert(result.message);
	} 
	else 
	{
		if (result.value 
		&& !Array.isArray(result.value)
		&& Object.keys(result.value).length > 0
		&& Object.keys(result.value)[0] != "") {
			/* create a new blank workbook */
			var wb = XLSX.utils.book_new();			
			var fileName = "estrazione_completa";
			var fileType = "xlsx";
			
			Object.keys(result.value).map( (key, index) => {
				
				// ***************************************
				// ** NOME DEL FOGLIO: LIMITE 31 CARATTERI
				let ws_name = key.slice(0, 29);
				// rimoviamo i caratti non accettati
				// ? * / \ [ ]
				ws_name = ws_name.replace("*", "_");
				ws_name = ws_name.replace("?", "_");
				ws_name = ws_name.replace("/", "_");
				ws_name = ws_name.replace("\\", "_");
				ws_name = ws_name.replace("[", "_");
				ws_name = ws_name.replace("]", "_");
				// ***************************************
				
				let ws_data = result.value[key];
				let ws = XLSX.utils.aoa_to_sheet(ws_data[0]);
				ws['!cols'] = [];
				let len = ws_data[0][0].length;
				for (let i=0; i < len; i++){
					ws['!cols'].push({ width: 20 });
				}
				
				XLSX.utils.book_append_sheet(wb, ws, ws_name);				
			});
			return XLSX.writeFile(wb, null || fileName + "." + (fileType || "xlsx"));				
		} else {
			alert("I dati non sono presenti.");
		}
	}
}

function Scarica(index) {
	
	if( Number( frmSearch.AA.value ) <= 0 ){ formScarica.AA = -1; }
	else{ formScarica.AA.value = frmSearch.AA.value; }

	formScarica.Commessa.value = frmSearch.Commessa.value;
	formScarica.IdOfferta.value = frmSearch.IdOfferta.value;

	if( Number( frmSearch.senza.checked ) == 0 ){
		formScarica.AA_senza = 0;
	}
	else{
		formScarica.AA_senza.value = frmSearch.senza.checked ? 1 : 0;
	}
	
	if( Number( frmSearch.con.checked ) == 0 ){
		formScarica.AA_con = 0;
	}
	else{
		formScarica.AA_con.value = frmSearch.con.checked ? 1 : 0;
	}
	
	formScarica.Mese.value = frmSearch.Mese.value;
	formScarica.Anno.value = frmSearch.Anno.value;
	formScarica.Mail.value = frmSearch.Mail.value;
	
	formScarica.Tipologia.value = index;
	
	if ( index == 3 ){
		var obj = {}; 
		obj = jhp_frm(document.formScarica);

		manageExcel(obj);
	}
	else if( index == 4 ){
		manageCSV(1);
		//manageCSV(0);
		setTimeout(function(){
			manageCSV(0); //This will be delayed for one second
			
			setTimeout(function(){
				sendCSVViaFTP();
			}, 2000);
		}, 2000);
	}
	else{
		
		formScarica.submit();
	}
}

function attesaConsolidazioneOfferta() {   
	//console.log("attesaConsolidazioneOfferta");  
	$('#divInner').html("<h1>Consolidazione in corso...</h1>").delay(2000);
	$('#msgErrorAvvioRicerca').remove();
}

function fineAttesaConsolidazioneOfferta() {   
	//console.log("fineAttesaConsolidazioneOfferta");  
	$('#divInner').html("<h2>Consolidazione Effettuata</h2>")/*.delay(5000)*/;
	$('#msgErrorAvvioRicerca').remove();  	
}
