import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

# Language configuration
USE_ODIA = False  # Set to True for Odia labels

# Configure matplotlib for better Unicode support
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['legend.fontsize'] = 11

# Translation dictionaries
labels = {
    'xlabel': {
        'en': 'Simulation Attempts',
        'odia': 'ସିମୁଲେସନ ପ୍ରୟାସ'
    },
    'ylabel': {
        'en': 'No. of Vehicles passed per 1 Simulation',
        'odia': 'ପ୍ରତି ସିମୁଲେସନରେ ଯାଇଥିବା ଯାନ ସଂଖ୍ୟା'
    },
    'title': {
        'en': 'Comparison: Current Static System vs Our Dynamic System',
        'odia': 'ତୁଳନା: ବର୍ତ୍ତମାନର ସ୍ଥିର ବ୍ୟବସ୍ଥା ବନାମ ଆମର ଗତିଶୀଳ ବ୍ୟବସ୍ଥା'
    },
    'legend': {
        'static': {'en': 'Static System', 'odia': 'ସ୍ଥିର ବ୍ୟବସ୍ଥା'},
        'dynamic': {'en': 'Dynamic System', 'odia': 'ଗତିଶୀଳ ବ୍ୟବସ୍ଥା'}
    }
}

# Get current language
lang = 'odia' if USE_ODIA else 'en'

# Read and process data
columns = ['Static', 'Dynamic']
df = pd.read_csv("chart.csv", usecols=columns)

# Create enhanced plot
fig, ax = plt.subplots(figsize=(12, 8))

# Plot data with better styling
static_line = ax.plot(df.index + 1, df['Static'], 
                     marker='o', linewidth=2.5, markersize=8, 
                     color='#e74c3c', label=labels['legend']['static'][lang])
dynamic_line = ax.plot(df.index + 1, df['Dynamic'], 
                      marker='s', linewidth=2.5, markersize=8, 
                      color='#2ecc71', label=labels['legend']['dynamic'][lang])

# Customize plot appearance
ax.set_xlabel(labels['xlabel'][lang], fontweight='bold')
ax.set_ylabel(labels['ylabel'][lang], fontweight='bold')
ax.set_title(labels['title'][lang], fontweight='bold', pad=20)

# Add grid with custom styling
ax.grid(True, linestyle='--', alpha=0.7, linewidth=0.8)
ax.set_facecolor('#f8f9fa')

# Customize legend
legend = ax.legend(loc='upper left', frameon=True, fancybox=True, shadow=True)
legend.get_frame().set_facecolor('#ffffff')
legend.get_frame().set_alpha(0.9)

# Add performance improvement annotation
if len(df) > 0:
    static_avg = df['Static'].mean()
    dynamic_avg = df['Dynamic'].mean()
    improvement = ((dynamic_avg - static_avg) / static_avg) * 100
    
    improvement_text = f"+{improvement:.1f}% improvement" if lang == 'en' else f"+{improvement:.1f}% ଉନ୍ନତି"
    ax.annotate(improvement_text, 
                xy=(0.7, 0.95), xycoords='axes fraction',
                bbox=dict(boxstyle="round,pad=0.3", facecolor='lightgreen', alpha=0.8),
                fontsize=12, fontweight='bold')

# Adjust layout and display
plt.tight_layout()
plt.show()

# Print summary statistics
if len(df) > 0:
    print(f"\n{'=== Performance Summary ===' if lang == 'en' else '=== କାର୍ଯ୍ୟଦକ୍ଷତା ସାରାଂଶ ==='}")
    print(f"{'Static System Average:' if lang == 'en' else 'ସ୍ଥିର ବ୍ୟବସ୍ଥା ହାରାହାରି:'} {static_avg:.1f}")
    print(f"{'Dynamic System Average:' if lang == 'en' else 'ଗତିଶୀଳ ବ୍ୟବସ୍ଥା ହାରାହାରି:'} {dynamic_avg:.1f}")
    print(f"{'Improvement:' if lang == 'en' else 'ଉନ୍ନତି:'} {improvement:.1f}%")