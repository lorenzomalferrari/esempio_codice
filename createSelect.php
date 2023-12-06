<?php

    $selectAnni = '
        <option selected value="">Selezionare l\'anno</option>';

    while ( $queryAnni && $rsAnni=ntxRecord($queryAnni) )
    {		
        foreach($rsAnni as $key=>$value)
        {
            $js[$key] = ntxJs($value);
            $html[$key] = htmlentities($value);
        }

        $AnnoInizio = $html[AnnoInizio];
        $AnnoFine = $html[AnnoFine];

        for ($i=$AnnoInizio; $i <= $AnnoFine; $i++) {
            if ($i == $annoCorrente) $selected = "selected";
            else $selected = "";

            $selectAnni .= <<<SEL
                <option $selected value=$i>$i</option>
SEL;
        }
    }
?>