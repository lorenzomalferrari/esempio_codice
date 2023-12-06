<?php
    /** 
     * il file riceve un array nominato $mc che contiene tutti i valori da usare per gestire i calcoli
     * 
     * **/
	require_once("calcolo_anni.inc");
	$CalcoloCanoniDinamico = new CalcoloCanoniDinamico();

	//Default - se valori non configurati da Utente
	$decimaliQTA = 4;
	$decimaliFattore = 5;
	$decimaliCanone = 9;
	$decimaliFattoreISTAT = 6;
	
	if( ! is_numeric( $modNIntF ) ) { $modNIntF = 0; }

    /** inizio gestione delle variabili **/
	$SQL_Cifre = <<<sql
		SELECT  
			decimaliQTA
		FROM
			Commesse
		WHERE
			IDCommessa = $IdCommessa
sql;

	$decimaliQTA_sql = (int) ntxScalar($SQL_Cifre);
	if($decimaliQTA_sql > 0){
		$decimaliQTA = $decimaliQTA_sql;
	}
	
	$SQL_Cifre = <<<sql
		SELECT  
			decimaliFattore
		FROM
			Commesse
		WHERE
			IDCommessa = $IdCommessa
sql;

	$decimaliFattore_sql = (int) ntxScalar($SQL_Cifre);
	if($decimaliFattore_sql > 0){
		$decimaliFattore = $decimaliFattore_sql;
	}
	
	$SQL_Cifre = <<<sql
		SELECT
			decimaliCanone
		FROM
			Commesse
		WHERE
			IDCommessa = $IdCommessa
sql;

	$decimaliCanone_sql = (int) ntxScalar($SQL_Cifre);
	if($decimaliCanone_sql > 0){
		$decimaliCanone = $decimaliCanone_sql;
	}
	
	/*
    DECIMALI ISTAT
		$SQL_CifreISTAT = <<<sql
		SELECT  
			decimaliFattoreISTAT
		FROM
			Commesse
		WHERE
			IDCommessa = $IdCommessa
sql;

	$decimaliFattoreISTAT_sql = (int) ntxScalar($SQL_CifreISTAT);
	if($decimaliFattoreISTAT_sql > 0){
		$decimaliFattoreISTAT = $decimaliFattoreISTAT_sql;
	}
	*/
	
    /** fine gestione delle variabili **/

/*****
	RECUPERO E SALVO I DATI PER IL CALCOLO
*****/

	$qta = round( $mc[QTA] , $decimaliQTA );
	$Fattore      = round( $mc[Fattore] , $decimaliFattore );
	$FattoreLight = round( $mc[FattoreLight] , $decimaliFattore );

	$FacilityManagementLight = $mc[FacilityManagementLight]; //TRUE O FALSE
		
	$DivisoreFattore            = round( $mc[DivisoreFattore],0);
	$MoltiplicatoreFattore 		= round( $mc[MoltiplicatoreFattore],0);
	
	$MaggPerc = round($mc[MaggPerc],2);
	
	$CinquePerCento = $mc[CinquePerCento]; //TRUE O FALSE
	$Migliorie = $mc[Migliorie]; //TRUE O FALSE
		
	$nIntAnno = round( $mc[NIntOre] , $modNIntF);

	$MesiErog = $mc[MesiErogazioneAnno] ? $mc[MesiErogazioneAnno] : 12;
	
	if( !is_null($MesiErogF) ){
		$MesiErog = $MesiErogF;
	}
	
	$FreqQ = $mc[FreqQ] ? $mc[FreqQ] : 1;
	
	$Durata = is_numeric($mc[Durata]) ? $mc[Durata] : 1;
	$DurataF = $mc[DurataF];
	
	$IncrementoImportoAnno = $mc[IncrementoImporto];
	$IncImportoMese = round ( ( $IncrementoImportoAnno / $MesiErog ) , 2);
	
	/***** Zona Ottengo il Fattore giusto da usare *****/
	$fattore = $CalcoloCanoniDinamico->ottieniFattore($Fattore,$FattoreLight,$FacilityManagementLight);
	$fattore = round( $fattore , $decimaliFattore );

	/***** Zona DivisoreFattore / MoltiplicatoreFattore *****/
	$fattore = $CalcoloCanoniDinamico->divFatPerDivFatt($fattore,$DivisoreFattore);
	$fattore = round( $fattore , $decimaliFattore );
	$fattore = $CalcoloCanoniDinamico->molFatPerMoltFatt($fattore,$MoltiplicatoreFattore);
	$fattore = round( $fattore , $decimaliFattore );
	
    /***** Applicazione della Maggiorazione % *****/
	$fattore = $CalcoloCanoniDinamico->aggMaggPerc($fattore,$MaggPerc);
	$fattore = round( $fattore , $decimaliFattore );
	
    /***** Applicazione delle Migliorie *****/
	$fattore = $CalcoloCanoniDinamico->aggMigliorie($fattore,$Migliorie);
	$fattore = round( $fattore , $decimaliFattore );

	if( $bit_Rev == true ){ 

		$fattorePrezziario = $CalcoloCanoniDinamico->ottieniFattoreNuovoPrezziario(
			$fattore,
			$NuovoPrezzo,
			$Manodopera,
			$PrezzoManodopera,
			$QuotaNonRibassoMan,
			$MaggiorazioneMan,
			$ScontoConvenzMan,
			$Migliorie
		);
        
		$fattorePrezziario = $CalcoloCanoniDinamico->aggMaggPerc($fattorePrezziario,$MaggPerc);
		if ( !($Manodopera == 1) ) { $fattorePrezziario = $CalcoloCanoniDinamico->aggMigliorie($fattorePrezziario,$Migliorie); }
		
        $fattorePrezziario = round( $fattorePrezziario , $decimaliFattore );
		
        if( $fattorePrezziario > 0){
			$fattore = $fattorePrezziario;
		}
	}

	$arrayVariabili = array(
		"fattore" => $fattore,
		"qta" => $qta,
		"nIntAnno" => $nIntAnno,
		"MesiErog" => $MesiErog,
		"Durata" => $Durata,
		"FreqQ" => $FreqQ,
		"anno" => $mc[anno],
		"mese" => $mc[mese],
		"Ticket" => $Ticket,
		"ics" => $ics,
	);

    $IdTipologiaUM = $mc[UM];
	
	//Ottengo i dati dalla tabella TipologiaUM
	$sqlUM = <<< sql
		SELECT 
			tblUnitaMisura.Id,
			tblUnitaMisura.Descrizione as um,
			MetodologiaUM.canoneMensile,
			MetodologiaUM.canoneAnnuo,
			TipologiaUM.IdCommessa
		FROM 
			TipologiaUM
				inner join tblUnitaMisura on tblUnitaMisura.Id = TipologiaUM.IdTblUnitaMisura
				inner join MetodologiaUM on MetodologiaUM.Id = TipologiaUM.IdMetodologiaUM 
		WHERE 
				TipologiaUM.IdCommessa = $IdCommessa
			AND 
				TipologiaUM.Id = $IdTipologiaUM
sql;
	$queryUM = ntxQuery($sqlUM);
	
	$formCanMes = "";
	$formCanAnn = "";
	
	$canoneMens = 0;
	$canoneAnno = 0;
	
	while( $htmlUM = ntxRecord($queryUM) ){
		$um = $htmlUM[um];
		$formCanMens = $htmlUM[canoneMensile];
		$formCanAnno = $htmlUM[canoneAnnuo];

		$calc2 = $CalcoloCanoniDinamico->calcCanone($formCanMens,$arrayVariabili);

		$canoneMens += $calc2;
	}
	
	$canoneMens = $CalcoloCanoniDinamico->applicaScontoSuCanone($canoneMens, $Sconto, $EscludiSconto);
	
	/***** Gestione CinquePerCento e Migliorie *****/
	$canoneMens = $CalcoloCanoniDinamico->aggCinquePerc($canoneMens,$CinquePerCento);			

    $totMese = $CalcoloCanoniDinamico->aggIncrementoImporto($canoneMens, $IncrementoImportoMese);
	$totMese = round($totMese, $decimaliCanone);
?>