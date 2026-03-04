<?php

namespace App\Services;

use App\Models\CollaborationAgreement;

class AIScriptGenerator
{
    public function generate(CollaborationAgreement $agreement): string
    {
        $brand = $agreement->brand;
        $creator = $agreement->creator;

        $script = "# Collaboration Script for {$brand->brand_name} x {$creator->creator_name}\n\n";

        $script .= "## Campaign Overview\n";
        $script .= "**Brand:** {$brand->brand_name}\n";
        $script .= "**Creator:** {$creator->creator_name}\n";
        $script .= "**Campaign:** {$agreement->title}\n\n";

        if ($agreement->description) {
            $script .= "**Description:** {$agreement->description}\n\n";
        }

        $script .= "## Content Guidelines\n\n";

        // Generate hooks based on brand category
        $hooks = $this->generateHooks($brand->category_primary);
        $script .= "### Suggested Hooks\n";
        foreach ($hooks as $hook) {
            $script .= "- {$hook}\n";
        }
        $script .= "\n";

        // Content structure
        $script .= "### Content Structure\n";
        $script .= "1. **Opening Hook** (first 3 seconds)\n";
        $script .= "   - Grab attention immediately\n";
        $script .= "   - Use one of the suggested hooks above\n\n";

        $script .= "2. **Problem/Pain Point** (5-10 seconds)\n";
        $script .= "   - Relate to your audience's needs\n";
        $script .= "   - Build empathy and connection\n\n";

        $script .= "3. **Solution Introduction** (10-15 seconds)\n";
        $script .= "   - Introduce {$brand->brand_name}\n";
        $script .= "   - Show the product/service in action\n\n";

        $script .= "4. **Key Benefits** (15-20 seconds)\n";
        $script .= "   - Highlight 2-3 unique selling points\n";
        $script .= "   - Show real results or transformations\n\n";

        $script .= "5. **Call to Action** (last 5 seconds)\n";
        $script .= "   - Direct viewers to link in bio\n";
        $script .= "   - Mention any discount codes or special offers\n\n";

        // Talking points
        $script .= "## Key Talking Points\n";
        $talkingPoints = $this->generateTalkingPoints($brand, $creator);
        foreach ($talkingPoints as $point) {
            $script .= "- {$point}\n";
        }
        $script .= "\n";

        // Delivery details
        $script .= "## Deliverables\n";
        $script .= "- **Content Pieces:** {$agreement->content_deliverables}\n";
        $script .= "- **Timeline:** ";
        if ($agreement->start_date && $agreement->end_date) {
            $script .= "{$agreement->start_date->format('M d, Y')} - {$agreement->end_date->format('M d, Y')}\n";
        } else {
            $script .= "To be determined\n";
        }
        $script .= "- **Platforms:** ";
        $platforms = [];
        if ($creator->instagram_url) {
            $platforms[] = 'Instagram';
        }
        if ($creator->tiktok_url) {
            $platforms[] = 'TikTok';
        }
        if ($creator->youtube_url) {
            $platforms[] = 'YouTube';
        }
        $script .= implode(', ', $platforms ?: ['TBD'])."\n\n";

        // Compensation
        $script .= "## Compensation\n";
        $script .= match ($agreement->payment_type) {
            'fixed' => "**Fixed Payment:** \${$agreement->fixed_payment}\n",
            'commission' => "**Commission:** {$agreement->commission_percentage}% of sales\n",
            'hybrid' => "**Base Payment:** \${$agreement->fixed_payment}\n**Plus Commission:** {$agreement->commission_percentage}% of sales\n",
        };
        $script .= "\n";

        // Best practices
        $script .= "## Best Practices\n";
        $script .= "- Be authentic and natural - don't sound scripted\n";
        $script .= "- Use your own voice and style\n";
        $script .= "- Show genuine enthusiasm for the product\n";
        $script .= "- Engage with comments and questions\n";
        $script .= "- Use relevant hashtags and tags\n";
        $script .= "- Tag {$brand->brand_name} in your content\n\n";

        $script .= "---\n\n";
        $script .= "*This script is AI-generated and should be customized to match your unique voice and style.*";

        return $script;
    }

    private function generateHooks(string $category): array
    {
        return match (strtolower($category)) {
            'fashion', 'beauty' => [
                "POV: You found the perfect [product category]",
                "If you're still using [competitor], you need to see this",
                "Wait...this actually works?!",
                "The [product] that changed my entire routine",
            ],
            'food', 'beverage' => [
                "I'm obsessed with this [product]",
                "You NEED to try this if you love [category]",
                "This is the best [product] I've ever had",
                "POV: You discover your new favorite [product]",
            ],
            'fitness', 'wellness' => [
                "This changed my [fitness/wellness] game",
                "I wish I knew about this sooner",
                "The secret to [benefit]? This right here",
                "If you struggle with [pain point], watch this",
            ],
            'tech', 'gadgets' => [
                "This might be the coolest thing I own",
                "Stop scrolling - you need to see this",
                "This [product] is a game-changer",
                "I can't believe I lived without this",
            ],
            default => [
                "You need to see this",
                "This is incredible",
                "Wait until you see what this does",
                "I found the perfect [product]",
            ],
        };
    }

    private function generateTalkingPoints(object $brand, object $creator): array
    {
        $points = [];

        // Add brand-specific points
        if ($brand->description) {
            $points[] = "Why I love {$brand->brand_name}: ".substr($brand->description, 0, 100).'...';
        }

        // Add audience-specific points
        if ($creator->follower_age_min && $creator->follower_age_max) {
            $points[] = "Perfect for anyone aged {$creator->follower_age_min}-{$creator->follower_age_max}";
        }

        // Add category-specific points
        $points[] = "Great for anyone interested in {$brand->category_primary}";

        // Add social proof
        $points[] = 'Real results that you can see';
        $points[] = 'Easy to use and fits into your daily routine';
        $points[] = 'High quality and worth the investment';

        return $points;
    }
}
