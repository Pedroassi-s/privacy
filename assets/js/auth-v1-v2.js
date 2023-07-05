$(function () {
    if ($("#TokenV2").length > 0 && $("#TokenV2").val() != "") {
        CarregarStorage();
    }
});

function CarregarStorage() {
    var resultLogin = JSON.parse($("#TokenV2").val());

    //Preencher V1
    let wtv1 = JSON.parse(atob(resultLogin.tokenV1.split('.')[1].replace('-', '+').replace('_', '/')));
    let d0v1 = new Date(0);

    d0v1.setUTCSeconds(wtv1.exp);
    d0v1.setHours(d0v1.getHours());
    
    localStorage.setItem("privacy_v1_token", resultLogin.tokenV1);
    localStorage.setItem("privacy_v1_expiraEm", (`${d0v1.getUTCFullYear()}-${(("0" + d0v1.getUTCMonth() + 1)).slice(-2)}-${("0" + d0v1.getUTCDate()).slice(-2)}T${("0" + d0v1.getUTCHours()).slice(-2)}:${("0" + d0v1.getUTCMinutes()).slice(-2)}:${("0" + d0v1.getUTCSeconds()).slice(-2)}.000Z`));
    //2022-01-23T17:49:29.000Z

    //Preencher V2
    let wt = JSON.parse(atob(resultLogin.token.split('.')[1]));
    let d1 = new Date(0);

    let arrRoles = [];
    let arrClaims = [];

    d1.setUTCSeconds(wt.exp);
    d1.setHours(d1.getHours());

    if (wt.role !== null && wt.role !== undefined) {
        if (typeof wt.role === 'string') {
            wt.role.split(',').map((i) => {
                var role;
                switch (i) {
                    case "Admin":
                        role = 0;
                        break;
                    case "Client":
                        role = 1;
                        break;
                    case "Creator":
                        role = 2;
                        break;
                }
                if (role)
                    arrRoles.push(role)
            });
        }
        if (typeof wt.role === 'object') {
            wt.role.map((i) => {
                var role;
                switch (i) {
                    case "Admin":
                        role = 0;
                        break;
                    case "Client":
                        role = 1;
                        break;
                    case "Creator":
                        role = 2;
                        break;
                }
                if (role)
                    arrRoles.push(role)
            });
        }
    }

    if (wt.claim !== null && wt.claim !== undefined) {
        if (typeof wt.claim === 'string') {
            wt.claim.split(',').map((i) => {
                var claim;
                switch (i) {
                    case "CanBuyEverything":
                        claim = 0;
                        break;
                    case "CanSellEverything":
                        claim = 1;
                        break;
                    case "HasTraditionalBankAccount":
                        claim = 2;
                        break;
                    case "HasOnlineBankAccount":
                        claim = 3;
                        break;
                }
                if (claim)
                    arrClaims.push(claim)
            });
        }
        if (typeof wt.claim === 'object') {
            wt.claim.map((i) => arrClaims.push(claim));
        }
    }

    localStorage.setItem("privacy_v2_token", resultLogin.token);
    localStorage.setItem("privacy_v2_expireIn", (`${d1.getUTCFullYear()}-${(("0" + d1.getUTCMonth() + 1)).slice(-2)}-${("0" + d1.getUTCDate()).slice(-2)}T${("0" + d1.getUTCHours()).slice(-2)}:${("0" + d1.getUTCMinutes()).slice(-2)}:${("0" + d1.getUTCSeconds()).slice(-2)}.000Z`));

    localStorage.setItem("privacy_v2_roles", arrRoles);
    localStorage.setItem("privacy_v2_claims", arrClaims);
}