import wave
import struct
import math
import random

# Parameters
sample_rate = 44100
duration = 45.0  # seconds
num_samples = int(sample_rate * duration)
filename = "microcosm_reverie_v2.wav"

def generate_ambient():
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)

        print(f"Generating {duration}s of ambient audio...")

        for i in range(num_samples):
            t = float(i) / sample_rate
            
            # 1. Base Drone (Deep Sine)
            # 55Hz (A1) and slight detune
            base_freq = 55.0
            drone = math.sin(2 * math.pi * base_freq * t)
            drone += 0.5 * math.sin(2 * math.pi * (base_freq * 1.01) * t)
            
            # 2. Evolving Harmonics (Slow modulation)
            mod1 = 0.5 + 0.5 * math.sin(2 * math.pi * 0.05 * t)
            harm1 = math.sin(2 * math.pi * (base_freq * 3) * t) * mod1
            
            mod2 = 0.5 + 0.5 * math.cos(2 * math.pi * 0.07 * t)
            harm2 = math.sin(2 * math.pi * (base_freq * 5) * t) * mod2
            
            # 3. Micro-Arpeggio (Generative feel)
            arp_freqs = [220, 330, 440, 660, 880]
            arp_speed = 0.4 # slower tempo
            arp_index = int(t / arp_speed) % len(arp_freqs)
            arp_env = 1.0 - ((t % arp_speed) / arp_speed)
            arp = math.sin(2 * math.pi * arp_freqs[arp_index] * t) * arp_env * 0.15
            
            # 4. Organic Clicks (Random spikes)
            click = 0
            if random.random() < 0.00005:
                click = (random.random() * 2.0 - 1.0) * 0.3
            
            # Mix
            sample = (drone * 0.3 + harm1 * 0.15 + harm2 * 0.1 + arp + click) * 0.6
            
            # Fade in/out
            if t < 3.0:
                sample *= (t / 3.0)
            elif t > duration - 3.0:
                sample *= ((duration - t) / 3.0)

            # Clamp and Convert to 16-bit PCM
            sample = max(-1, min(1, sample))
            packed_sample = struct.pack('<h', int(sample * 32767))
            wav_file.writeframes(packed_sample)

    print(f"Done: {filename}")

if __name__ == "__main__":
    generate_ambient()
