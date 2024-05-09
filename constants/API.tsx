import AsyncStorage from '@react-native-async-storage/async-storage';


export const setUpCourse = async(course: Course) => {
  try {
    const courseStringify = JSON.stringify(course)
    await AsyncStorage.setItem('course', courseStringify)
  } catch(e) {
            console.error(e)
        }
}

export const updateCourseData = async(course: Course) => {
  try {
    const courseStringify = JSON.stringify(course)
    await AsyncStorage.setItem('course', courseStringify)
  } catch (e) {
    console.error(e)
  }
}

export const getScoreCardData = async() => {
  try {
    const jsonData = await AsyncStorage.getItem('course')
    return jsonData != null ? JSON.parse(jsonData) : null
  } catch(e){
    console.error(e)
  }
}

export const resetScorecard = async () => {
  try {
    await AsyncStorage.removeItem('course')
  } catch(e) {console.error(e)}
  console.log('removed.')
}


/////////////////////////////////////////////////// CLASSES ///////////////////////////////////////////////////


//???????///////?????????///// HARD CODE ROUND.ID FIX IT //////????????//////////????????/////???????/////????
export class Round {
  id : number = 1;
  holesPlayed : number = 0;
  holes : {[num:number]:HoleStats} = {};
  putts : number = 0; // sum of this.holes.hole.putts
  pures : number = 0; // sum of this.holes.hole.pure
  goods : number = 0; // sum of this.holes.hole.good
  bads : number = 0; //  sum of this.holes.hole.bad
  toPar : number = 0;
  toPar3 : number = 0; // sum of this.holes.hole.toPar where this.holes.hole.par == 3
  toPar4 : number = 0; // sum of this.holes.hole.toPar where this.holes.hole.par == 4
  toPar5 : number = 0; // sum of this.holes.hole.toPar where this.holes.hole.par == 5
  GIRs : number = 0; // count() of this.holes.hole.gir == true
  FIRs : number = 0; // count() of this.holes.hole.fir == true
  totalStrokes : number = 0;


  addRoundHole(hole: Hole, gir: boolean, putts: number, pure: number, good: number, bad: number, fir?: boolean) {
    const roundHole = new HoleStats(hole, putts, pure, good, bad, gir, fir);
    this.holes[hole.num] = roundHole;

    this.holesPlayed++;
    // Update aggregated statistics based on the newly added RoundHole
    this.putts += putts;
    this.pures += pure;
    this.goods += good;
    this.bads += bad;
    this.totalStrokes += (putts+pure+good+bad);
    this.toPar += roundHole.toPar;
    if (hole.par === 3) {
        this.toPar3 += roundHole.toPar;
    } else if (hole.par === 4) {
        this.toPar4 += roundHole.toPar;
    } else if (hole.par === 5) {
        this.toPar5 += roundHole.toPar;
    }
    if (gir) {
        this.GIRs++;
    }
    if (fir) {
        this.FIRs++;
    }
}
}


export class HoleStats {
  hole: Hole;
  putts: number;
  pure: number;
  good: number;
  bad : number;
  gir : boolean;
  fir?: boolean;
  toPar: number;

  constructor(
    hole: Hole,
    putts: number,
    pure: number,
    good: number,
    bad : number,
    gir : boolean,
    fir?: boolean){
      this.hole = hole;
      this.putts = putts;
      this.pure = pure;
      this.good = good;
      this.bad = bad;
      this.gir = gir;
      this.fir = fir;
      this.toPar = (putts+pure+good+bad)-this.hole.par
  }

}

export class Hole {
    num: number;
    color: string;
    par: number;
    yardage: number;
    redYardage: number;

    constructor(num:number,color:string,par:number,yardage:number, redYardage:number) {
      this.num = num;
      this.color = color;
      this.par = par;
      this.yardage = yardage;
      this.redYardage = redYardage;
    }
    
  }
  
  

  
  export class Teebox {
    color: string;
    holes: {[num:number]: Hole} = {};
    rounds: {[id:number]: Round} = {};
    girGoal: number;
    firGoal: number;
    puttGoal: number;
    strokeGoal: number;
    par: number = 0;
    yardage: number = 0;
    avgStrokes: number = 0;
    
  
    constructor(color:string, girGoal:number, puttGoal:number, firGoal:number, strokeGoal:number) {
      this.color = color
      this.girGoal = girGoal
      this.firGoal = firGoal
      this.puttGoal = puttGoal
      this.strokeGoal = strokeGoal
    }
  
    addHole(hole: Hole): void {
      this.holes[hole.num] = hole;
    }
    addRound(round: Round): void {
      this.rounds[round.id] = round;
    }

    setGirGoal(num:number):void{
      this.girGoal = num;
    }

    setFirGoal(num:number):void{
      this.firGoal = num;
    }

    setPuttGoal(num:number):void{
      this.puttGoal = num;
    }

    setStrokeGoal(num:number):void{
      this.strokeGoal = num;
    }

    updateParDist(): void {
      const dist = Object.values(this.holes).reduce((total,hole)=> total += hole.yardage, 0);
      const par = Object.values(this.holes).reduce((total,hole)=> total += hole.par,0);
      this.par = par;
      this.yardage = dist;
    }
    updateAvgStrokes(): void {
      const total = Object.values(this.rounds).reduce((total, round)=> total += round.totalStrokes,0);
      this.avgStrokes = total / Object.keys(this.rounds).length;
    }
  }

  export class Course {
    name: string;
    teeboxes: { [color: string]: Teebox } = {};

    constructor(name: string) {
        this.name = name;
    }

    addTeebox(teebox: Teebox) {
        this.teeboxes[teebox.color] = teebox;
    }

    getTeeboxByColor(color: string): Teebox{
      return this.teeboxes[color]; 
    }
}

  export const createNewCourseRound = (courseName:string,teeColor:string,girGoal:number,puttGoal:number,firGoal:number,strokeGoal:number): Course => {
    
    // if (courseName=='Dominion Meadows'){
      const par = [4,3,4,4,5,5,4,4,3,4,3,4,4,4,5,3,5,4]
      const blackYardage = [267,187,531,314,462,573,391,360,216,392,260,445,394,426,552,206,605,424]
      const redYardage = [210,125,286,263,370,415,299,260,101,320,187,306,250,279,381,95,462,286]
      ///////////////////////////////// Create Dominion Meadows //////////////////////////////////
      const DominionMeadows = new Course(courseName);
      ///////////////////////// Create Black Tee w/ goals and add holes /////////////////////////
      const Tees = new Teebox(teeColor,girGoal,puttGoal,firGoal,strokeGoal)
      for (let i = 1; i <= 18; i++){
        const hole = new Hole(i,teeColor,par[i-1],blackYardage[i-1],redYardage[i-1]);
        Tees.addHole(hole);
      }
      DominionMeadows.addTeebox(Tees)
      //////////////////////////////////// Create New Round ////////////////////////////////////
      const newRound = new Round();
      const tee = DominionMeadows.getTeeboxByColor(teeColor);
      tee?.addRound(newRound);
      // console.log(DominionMeadows)
      return DominionMeadows;

    // }
  }