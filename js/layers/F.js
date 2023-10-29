addLayer("F", {
    name: "Fusions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#BA233F",
    requires: new Decimal(1e25), // Can be a function that takes requirement increases into account
    resource: "experiments", // Name of prestige currency
    baseResource: "infects", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.87, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let eff1 = player.F.points.add(1).pow(0.32)
        if (hasUpgrade("F",14)) eff1 = eff1.add(2.5)
        return eff1
    },
    effectDescription() {
        dis = "which boosts crystals gain by "+ format(tmp.E.effect) +"x"
        return dis
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "F", description: "E: reset for Fusions", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
	infoboxes: {
        lore: {
            title: "Fusions",
            body: `Experiments and Fusions aren't a good combination.`,
        },
    },
    layerShown() {
        return hasUpgrade("E", 22);
      },
 upgrades: {
    rows: 2,
    cols: 5,
    11: {
        title: "Fusion 1",
        description: "This is stupidly cursed...Boost Infect Gain by 50x",
        cost: new Decimal(1),
    },
    12: {
        title: "Fusion 2",
        description: "What Am I even looking at...Boost Infect Gain by 33.33x",
        cost: new Decimal(15),
    },
    13: {
        title: "Fusion 3",
        description: "What in the hell...Boost Infect Gain by 60x",
        cost: new Decimal(80),
    },
    13: {
        title: "Fusion 4",
        description: "There's too many of them...Boosts Fusion Effect by 2.5x",
        cost: new Decimal(250),
    },
 },
 })
