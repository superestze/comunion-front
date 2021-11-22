import chartPath1 from '@/assets/chart-path-1.svg'
import chartPath11 from '@/assets/chart-path-11.svg'
import chartPath2 from '@/assets/chart-path-2.svg'
import chartPath3 from '@/assets/chart-path-3.svg'
import chartPath4 from '@/assets/chart-path-4.svg'
import chartPath5 from '@/assets/chart-path-5.svg'
import chartPath6 from '@/assets/chart-path-6.svg'
import chartPath7 from '@/assets/chart-path-7.svg'
import chartPath8 from '@/assets/chart-path-8.svg'
import { default as chartPath10, default as chartPath9 } from '@/assets/chart-path-9.svg'
import FranceChart from '@/assets/France-chart.svg'
import GermanyChart from '@/assets/Germany-chart.svg'
import SpainChart from '@/assets/Spain-chart.svg'
import SwedenChart from '@/assets/Sweden-chart.svg'
import UnitedKingdomChart from '@/assets/United-Kingdom-icon.svg'
import UnitedStatesChart from '@/assets/UnitedStates-chart.svg'
import { defineComponent } from 'vue'
import styles from './index.module.css'

export default defineComponent({
  name: 'UseCases',
  setup() {
    return () => (
      <div class="w-full overflow-hidden pt-60px sm:pt-158px pb-50px sm:pb-110px">
        <div class="relative z-1 w-311px sm:w-1110px m-auto">
          {/* title */}
          <h2 class="font-bold text-white text-center text-24px sm:text-48px">Pains of World</h2>
        </div>
        <div class="mt-65px flex-row items-center w-full <sm:hidden">
          <div class="flex items-center justify-center">
            <div class={styles.leftTopBox}>
              <p class="text-bold text-white text-36px leading-36px">Extreme Poverty</p>
              <p class="text-bold text-20px leading-36px text-[#00E0FE] mt-23px">
                Imbalanced access to opportunities
              </p>
              <p class="text-bold text-white text-18px leading-24px mt-12px w-457px">
                Inequalities are deepening for vulnerable populations in countries with weaker
                health systems due to Covid-19
              </p>
            </div>
            <div class={styles.rightTopBox}>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath1} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">100k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath2} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">86k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath3} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">60k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath4} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">56k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath5} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">55k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath6} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">38k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath7} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">15k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath8} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">14k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath9} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">11k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px w-30px" src={chartPath10} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">7k</span>
              </div>
              <div class="flex items-center mb-4px">
                <img class="h-20px" src={chartPath11} />
                <span class="text-[#00E1FF] text-10px leading-14px ml-5px">2k</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center mt-115px">
            <div class={styles.leftBottomBox}>
              <img src={FranceChart} class={`${styles.lineChartImg} z-1`} />
              <img src={UnitedKingdomChart} class={`${styles.lineChartImg} z-2`} />
              <img src={UnitedStatesChart} class={`${styles.lineChartImg} z-3`} />
              <img src={GermanyChart} class={`${styles.lineChartImg} z-4`} />
              <img src={SpainChart} class={`${styles.lineChartImg} z-5`} />
              <img src={SwedenChart} class={`${styles.lineChartImg} z-6`} />
            </div>
            <div class={styles.rightBottomBox}>
              <p class="text-bold text-white text-36px leading-36px">Wealth Gap</p>
              <p class="text-bold text-20px leading-36px text-[#00E0FE] mt-23px">
                Workers excluded from capital gain
              </p>
              <p class="text-bold text-white text-18px leading-24px mt-12px w-457px">
                High entry barriers for individuals to participate within the current VC/PE
                ecosystem; Big tech monopoly, rich gets richer
              </p>
            </div>
          </div>
        </div>
        <div class="mt-38px flex-row items-center justify-center m-auto w-311px sm:hidden">
          <div class={styles.box1}>
            <p class="text-bold text-white text-18px leading-18px">Extreme Poverty</p>
            <p class="text-bold text-12px leading-18px text-[#00E0FE] mt-8px">
              Imbalanced access to opportunities
            </p>
            <p class="text-bold text-white text-12px leading-15px mt-5px w-270px">
              Inequalities are deepening for vulnerable populations in countries with weaker health
              systems due to Covid-19
            </p>
          </div>
          <div class={styles.box2}>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath1} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-5px transform scale-60">
                100k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath2} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                86k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath3} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                60k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath4} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                56k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath5} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                55k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath6} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                38k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath7} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                15k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath8} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                14k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath9} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">
                11k
              </span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px w-30px object-contain object-left" src={chartPath10} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">7k</span>
            </div>
            <div class="flex items-center mb-3px h-9px">
              <img class="h-9px" src={chartPath11} />
              <span class="text-[#00E1FF] text-5px leading-14px ml-2px transform scale-60">2k</span>
            </div>
          </div>
          <div class={styles.box3}>
            <p class="text-bold text-white text-18px leading-18px">Wealth Gap</p>
            <p class="text-bold text-12px leading-18px text-[#00E0FE] mt-8px">
              Workers excluded from capital gain
            </p>
            <p class="text-bold text-white text-12px leading-15px mt-5px w-270px">
              High entry barriers for individuals to participate within the current VC/PE ecosystem;
              Big tech monopoly, rich gets richer
            </p>
          </div>
          <div class={styles.box4}>
            <img src={FranceChart} class={`${styles.lineChartImg} z-1`} />
            <img src={UnitedKingdomChart} class={`${styles.lineChartImg} z-2`} />
            <img src={UnitedStatesChart} class={`${styles.lineChartImg} z-3`} />
            <img src={GermanyChart} class={`${styles.lineChartImg} z-4`} />
            <img src={SpainChart} class={`${styles.lineChartImg} z-5`} />
            <img src={SwedenChart} class={`${styles.lineChartImg} z-6`} />
          </div>
        </div>
      </div>
    )
  }
})
