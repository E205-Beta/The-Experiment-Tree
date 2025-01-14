addLayer("F", {
    name: "Fusions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
    }},

    lockedData(){
        if(player.CT.points >= 1) unlocked = false;
    },
    color: "#322CA8",
    requires: new Decimal(1e30),
    requires(){ 
        let requirement = new Decimal(1e30);
        if (hasUpgrade('O', 12)) requirement = requirement.div(3e7)
        if (hasUpgrade('O', 13)) requirement = requirement.div(upgradeEffect('O', 13))
        if (requirement <= 0.99) requirement = new Decimal(1)
        return requirement
    },
    resource: "fusions", // Name of prestige currency
    baseResource: "infects", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.111, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("E",41)) mult = mult.times(upgradeEffect("E", 41))
        if (hasUpgrade('E', 46)) mult = mult.times(1.5)	
        if (hasAchievement('a', 42)) mult = mult.times(2.33333)
        if (hasUpgrade('H', 24)) mult = mult.times(upgradeEffect('H',24))
        if (hasUpgrade('R', 12)) mult = mult.times(upgradeEffect('R',12))
        if (hasUpgrade('F', 34)) mult = mult.times(upgradeEffect('F',34))
        if (player.W.unlocked) mult = mult.times(tmp.W.effect)
        if (hasMilestone('W', 11)) mult = mult.times(2.2)
        if (hasUpgrade('W', 13)) mult = mult.times(upgradeEffect('W',13))
        if (hasMilestone('W', 13)) mult = mult.times((player.W.points.max(1).add(1).pow(0.35)).max(1).min(1e200))
        if (hasUpgrade('W', 15) && hasUpgrade('c', 35)) mult = mult.times(upgradeEffect('c', 35))
        if (hasUpgrade('D', 13)) mult = mult.times("1e600")
        if (hasUpgrade('D', 31)) mult = mult.times("1e490")
        if (hasUpgrade('D', 35)) mult = mult.pow(1.03)
        if (hasUpgrade('D', 42)) mult = mult.times(upgradeEffect('D',42))
        
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expo = new Decimal(1)
        if (hasUpgrade('O', 11)) expo = expo.add(.15)
        return expo
    },
    effect() {
        let eff1 = player.F.points.add(1.3).pow(0.488)
        if (hasUpgrade("F",14)) eff1 = eff1.add(2.5)
        if (hasUpgrade('c', 54)) eff1 = eff1.times(3.5)
        if (hasMilestone('H', 15)) eff1 = eff1.times(2)
        if (hasMilestone('W', 12)) eff1 = eff1.times(4)
        if (hasUpgrade('O', 13)) eff1 = eff1.pow(1.2)
        if (hasUpgrade('O', 22)) eff1 = eff1.times(1e170)
        if (inChallenge('D', 11)) eff1 = eff1.pow(0.001)
        if (hasUpgrade('D', 31)) eff1 = eff1.times("1e3250")
        if (hasUpgrade('D', 33)) eff1 = eff1.pow(1.03)
        if (inChallenge('D', 12)) eff1 = new Decimal(1)
        
        eff1 = eff1.times(tmp.F.effectBase)
        return eff1
    },
    effectBase() {
        let base = new Decimal(1)
        if (hasUpgrade("F",16)) base = base.add(1)
        if (hasUpgrade('R', 12)) base = base.times(upgradeEffect('R',12))
        
        return base
    },
    effectDescription() {
        dis = "which boosts infects gain by "+ format(tmp.F.effect) +"x"
        if (hasUpgrade("F", 15)) dis = "which boosts infects & crystal gain by "+ format(tmp.F.effect) +"x";
        return dis
    },
    passiveGeneration() {
        let value1 = new Decimal(0);
        if (hasMilestone('W', 14)) value1 = value1.add(1)
        if (hasMilestone('D', 11)) value1 = new Decimal(1e50)
        if (inChallenge('D', 11)) value1 = new Decimal(0)
        if (inChallenge('D', 12)) value1 = new Decimal(0)
        return value1;
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "f: reset for Fusions", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
	infoboxes: {
        lore: {
            title: "Fusions",
            body() {
            let text 
            text = 
            `This section is completely fanmade...<br><br>
            ???: I heard something...<br>
            ???: What?<br>
            ???: I heard something.<br>
            ???: What do you mean?<br>
            ???: Like...like someone's putting duct tape on something...<br>
            ???: Oh... really? Well... I'm not scared of it. It's just tap-<br>
            - There was distant yelling ... -<br>
            ???: Oh...-<br>
            ???: Well I guess it's just two people yelling about the pipes leaking...<br>
            ???: I can see why, what's the point of putting duct tape on pipes...<br><br>
            
            - In a later Upgrade you'll see one of the names and more lore.. -<br>
            v1.3_rollout...`
            return text
            },
        },
    },
    layerShown() {
        let value = false
        if (hasUpgrade("c", 45) || player.F.unlocked) value = true;    
        if (hasUpgrade('R', 16) || player.CT.unlocked) value = false;
        if ((hasMilestone("O", 11) && hasUpgrade('c', 25) && hasUpgrade('c', 45)) || player.F.points.gte(1)) value = true;
        if (player.CT.points.gte(2) || hasUpgrade('D', 45)) value = false
        return value
      },
milestones: {
        11: {
            requirementDescription: "1 Fusions",
            effectDescription: "Keep the first 3 rows of Experiment Upgrades",
            done() { return player.F.points.gte(1)},
        },
        12: {
            requirementDescription: "3 Fusions",
            effectDescription: `
            Unlock the next row of Experiment Upgrades<br>
            Keep the first 3 Experiment Milestones on Reset`,
            done() { return player.F.points.gte(3)},
        },
        13: {
            requirementDescription: "20 Fusions",
            effectDescription() {
                let text = "Unlock the next row of Crystal Upgrades";
                if (hasMilestone("F", 13)) text = "Unlock the next row of Crystal Upgrades... Can we get something new??";
                return text;
              },
            done() { return player.F.points.gte(20)},
            unlocked() {return hasUpgrade('F', 12) || hasMilestone('F', 12)},
        },
        14: {
            requirementDescription: "100 Fusions",
            effectDescription() {
                let text = 
                `Keep the 4th Row of Experiment Upgrades (I wonder if you found the easier path...)`;
                if (hasMilestone("F", 14)) text =
                `Keep the 4th Row of Experiment Upgrades (Getting 100 Fusions before starting on the Experiment Upgrades of course)<br>
                Give us more Fusion stuff you damn mod creator...<br>
                It's annoying to go back and forth y'know.`;
                return text;
              },
            done() { return player.F.points.gte(100)},
            unlocked() {return hasUpgrade('F', 22) && hasMilestone('F', 13)},
        },
        15: {
            requirementDescription: "1e53 Infects and 5,000 Fusions",
            effectDescription() {
                let text = 
                `Unlock a couple more human upgrades (took you forever?)`;
                return text;
              },
            done() { return player.points.gte(1e53) && player.F.points.gte(5000)},
            unlocked() {return hasMilestone('F', 14)},
        },
    },
 upgrades: {
    rows: 3,
    cols: 6,
    11: {
        title: "Ayko",
        description: "Nyko & Abys...Boost Crystal gain by 12.5x",
        cost: new Decimal(1),
    },
    12: {
        title: "Cyberus",
        description: "Cyberruin & Virus...Boost Experiment Gain by 3.33x & Keep Crystal Upgrades on Fusion Reset!",
        cost: new Decimal(2),
        unlocked(){
            return hasUpgrade('F',11)
        },
    },
    13: {
        title: "Sombtox",
        description: "Somby & Kryptox...Boost Infect Gain by 60x",
        cost: new Decimal(6),
        unlocked(){
            return hasUpgrade('F',12)
        },
    },
    14: {
        title: "Snapko",
        description: "There's too many of them...Boosts Fusion Effect by 2.5x",
        cost: new Decimal(9),
        unlocked(){
            return hasUpgrade('F',13)
        },
    },
    15: {
        title: "Honzure",
        description: "Have the Fusion Effect effect Crystals also!",
        cost: new Decimal(11),
        unlocked(){
            return hasUpgrade('F',14)
        },
    },
    16: {
        title: "Kryruin",
        description: "Double and a half the Fusion Effect & keep Experiment Milestone 15!",
        cost: new Decimal(13),
        unlocked(){
            return hasUpgrade('F',15)
        },
    },
    21: {
        title: "Frostral",
        description: "Triple the Experiment Effect!",
        cost: new Decimal(17),
        unlocked(){
            return hasUpgrade('F',16)
        },
    },
    22: {
        title: "Lovegen",
        description: "Quadruple the Experiment Effect",
        cost: new Decimal(45),
        unlocked(){
            return hasUpgrade('F',21)
        },
    },
    23: {
        title: "Wenite",
        description: "5x the Experiment Effect",
        cost: new Decimal(740),
        unlocked(){
            return hasMilestone('H',14) && hasUpgrade('F',22)
        },
    },
    24: {
        title: "Morgana",
        description: "Triple the Human Effect",
        cost: new Decimal(1640),
        unlocked(){
            return hasUpgrade('F', 23) 
        },
    },
    25: {
        title: "Sydiver",
        description: "Fusions boosts Infects",
        effect() {
            return (player.F.points.max(1).add(1).pow(0.13)).max(1).min(22);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(22) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(75000),
        unlocked(){
            return hasMilestone('H',15) && hasUpgrade('F',24)
        },
    },
    26: {
        title: "Honeyruin",
        description: "Infects boosts Experiments",
        effect() {
            return (player.points.max(1).add(1).pow(0.0225)).max(1).min(106);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(106) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(225000),
        unlocked(){
            return hasUpgrade('F',25)
        },
    },
    31: {
        title: "Maluze",
        description: "Experiments boosts Humans",
        effect() {
            return (player.E.points.max(1).add(1).pow(0.0135)).max(1).min(50);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(50) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(5000000),
        unlocked(){
            return hasMilestone('R',12) && hasUpgrade('F', 26)
        },
    },
    32: {
        title: "Morgus",
        description: "Crystals boosts Experiments",
        effect() {
            return (player.c.points.max(1).add(1).pow(0.0112)).max(1).min(70);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(70) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(12000000),
        unlocked(){
            return hasUpgrade('F', 31)
        },
    },
    33: {
        title: "Lovevirus",
        description: "Infects boosts Crystals & Experiments",
        effect() {
            return (player.points.max(1).add(1).pow(0.009)).max(1).min(17);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(17) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(60000000),
        unlocked(){
            return hasUpgrade('F', 32)
        },
    },
    34: {
        title: "Nybeast",
        description: "Experiments boosts Fusions & Crystals",
        effect() {
            return (player.E.points.max(1).add(1).pow(0.0188)).max(1).min(44);
        },
        effectDisplay() {
            let capped = upgradeEffect(this.layer, this.id).gte(44) ? "(Capped)" : "";
            let text = `x${format(upgradeEffect(this.layer, this.id))} ${capped}`;
            return text;
        },
        cost: new Decimal(130000000),
        unlocked(){
            return hasUpgrade('F', 33)
        },
    },
    35: {
        title: "Abikaarme",
        description: "Quadtruple the Experiment Effect",
        cost: new Decimal(666666666),
        unlocked(){
            return hasUpgrade('F', 34)
        },
    },
    36: {
        title: "Weaponizing",
        description: "Unlock the next layer",
        cost: new Decimal(1.5e9),
        unlocked(){
            return hasUpgrade('F', 35)
        },
    },
 },
 })
